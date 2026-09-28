(function (root) {
  "use strict";

  var cache = new Map();
  var preparations = new Map();

  function decodeBase64(value) {
    if (typeof atob === "function") {
      var binary = atob(value);
      var bytes = new Uint8Array(binary.length);
      for (var index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
      }
      return bytes;
    }
    return new Uint8Array(Buffer.from(value, "base64"));
  }

  function bundledBytes(modelId, compressed) {
    var manifest = root.GSASRecModels && root.GSASRecModels[modelId];
    var chunks = root.GSASRecWeightChunks && root.GSASRecWeightChunks[modelId];
    if (!manifest || !chunks || !chunks.length) {
      throw new Error("Bundled model is missing: " + modelId);
    }

    var expectedLength = compressed ? manifest.compressedByteLength : manifest.byteLength;
    var bytes = new Uint8Array(expectedLength);
    var byteOffset = 0;
    chunks.forEach(function (encoded) {
      var chunk = decodeBase64(encoded);
      bytes.set(chunk, byteOffset);
      byteOffset += chunk.length;
    });
    if (byteOffset !== expectedLength ||
      (manifest.chunkCount != null && chunks.length !== manifest.chunkCount)) {
      throw new Error("Model byte length mismatch for " + modelId);
    }

    return bytes;
  }

  function cacheModel(modelId, bytes) {
    var manifest = root.GSASRecModels[modelId];
    if (bytes.byteLength !== manifest.byteLength) {
      throw new Error("Model byte length mismatch for " + modelId);
    }
    var floats = new Float32Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 4);
    var extendedTensor = null;
    var model = {
      manifest: manifest,
      tensor: function (name) {
        var spec = manifest.tensors[name];
        if (!spec) {
          throw new Error("Unknown tensor: " + name);
        }
        var base = floats.subarray(spec.offset, spec.offset + spec.length);
        var extra = manifest.catalogExtension;
        if (!extra || extra.tensorName !== name) return base;
        if (!extendedTensor) {
          if (base.length !== extra.nativeId * manifest.config.embeddingDim) {
            throw new Error("External movie row does not follow the base table");
          }
          extendedTensor = new Float32Array(base.length + extra.embedding.length);
          extendedTensor.set(base);
          extendedTensor.set(extra.embedding, base.length);
        }
        return extendedTensor;
      }
    };
    cache.set(modelId, model);
    return model;
  }

  function load(modelId) {
    if (cache.has(modelId)) return cache.get(modelId);
    var manifest = root.GSASRecModels && root.GSASRecModels[modelId];
    if (manifest && manifest.compression) {
      throw new Error("Compressed model has not been prepared: " + modelId);
    }
    return cacheModel(modelId, bundledBytes(modelId, false));
  }

  function prepare(modelId) {
    if (cache.has(modelId)) return Promise.resolve(cache.get(modelId));
    var manifest = root.GSASRecModels && root.GSASRecModels[modelId];
    if (!manifest || !manifest.compression) return Promise.resolve(load(modelId));
    if (preparations.has(modelId)) return preparations.get(modelId);
    var preparation = Promise.resolve().then(function () {
      if (manifest.compression !== "gzip" || typeof root.DecompressionStream !== "function") {
        throw new Error("This optional model needs a browser with gzip decompression support.");
      }
      var stream = new Blob([bundledBytes(modelId, true)]).stream();
      return new Response(stream.pipeThrough(new root.DecompressionStream("gzip"))).arrayBuffer();
    }).then(function (buffer) { return cacheModel(modelId, new Uint8Array(buffer)); });
    preparations.set(modelId, preparation);
    return preparation;
  }

  root.GSASRecBrowser = root.GSASRecBrowser || {};
  root.GSASRecBrowser.loadWeights = load;
  root.GSASRecBrowser.prepareWeights = prepare;
  root.GSASRecBrowser.supportsItem = function (manifest, id) {
    return Number.isInteger(id) && id > 0 && (manifest.itemIds
      ? Boolean(manifest.itemIds.canonicalToNative[id])
      : id <= manifest.config.numItems);
  };
  // Negative IDs belong exclusively to precomputed sequence inputs, never candidates.
  root.GSASRecBrowser.supportsInput = function (manifest, id) {
    return root.GSASRecBrowser.supportsItem(manifest, id) ||
      (Number.isInteger(id) && id < 0 && Boolean(manifest.textInputs && manifest.textInputs[id]));
  };
})(globalThis);
