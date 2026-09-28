# Third-party Notices

## PCTM / sequential-capacity-probes

`models/pctm-ml1m/` contains fitted transition evidence from the public
PCTM implementation at https://github.com/spotify-research/sequential-capacity-probes,
commit `705710f78abd613cd8ee139f7435d813eef2f8ab` (Apache License 2.0).
Fitting functions are retained under `sasha-playground/tools/pctm_vendor/`
with the upstream license and an adaptation notice. The browser scorer is
newly written, with reference-checked outputs and lossless FP32 model assets.
The input is the released training split from `asash/gSASRec-pytorch` at the
commit recorded below. No raw training events or user sequences are included.
Source checksums, fixed hyperparameters and split differences are documented
in the model audit and `docs/pctm-playground.md`.

## gSASRec-pytorch

The generated assets under `models/sasrec-ml1m/` and `models/gsasrec-ml1m/` are conversions of pretrained
checkpoints from:

- Project: `asash/gSASRec-pytorch`
- Repository: https://github.com/asash/gSASRec-pytorch
- Source commit: `7e350285fb4721377c96e20ace7c74bf19bea57b`
- Authors: Aleksandr Petrov and contributors
- License: Apache License 2.0

The original project describes the model published in:

Aleksandr Petrov and Craig Macdonald. "gSASRec: Reducing Overconfidence in
Sequential Recommendation Trained with Negative Sampling." RecSys 2023.

The browser implementation in this folder is newly written for this tutorial
repository. It follows the public architecture and checkpoint tensor names but
does not copy the reference Python implementation.

## User-provided pred checkpoint

`models/pred-sasrec-ml1m/` contains a conversion of Jan Malte Lichtenberg's
local `pred` MovieLens-1M checkpoint, run `20260326_145800_873757`.
Its manifest records the checkpoint SHA-256, reference Python source hashes,
tensor layout, and native-to-shared catalog mapping. The training commit was
not recorded in the checkpoint. The Apache-2.0 attribution above belongs to
Sasha's two releases, not this separately supplied checkpoint.

`runtime/pred-engine.js` is a newly written JavaScript implementation of its
forward pass. No pred Python source, raw rating rows, user sequences, or exact
MovieLens-1M title metadata are redistributed. The accompanying `audit.json`
contains aggregate counts, top-item IDs, and input checksums. See
`docs/pred-movielens-checkpoint.md` at the repository root for provenance and
reproduction instructions. Existing display labels and posters are reused.

The `models/pad-first-ml1m/` tutorial pilot was trained from scratch using the
same user-provided pred model definition and local MovieLens training split,
with a trainable PAD embedding and explicit first-item targets. Its generated
audit records the reference-source, training-code and input hashes. No pred
Python source or raw MovieLens records are redistributed. See
`docs/pad-first-checkpoint.md` at the repository root for the training recipe.

## ml1m-sas-mapping


The generated ID arrays under `data/mappings.js` originate from:

- Project: `asash/ml1m-sas-mapping`
- Repository: https://github.com/asash/ml1m-sas-mapping
- Source commit: `56013fb1def17a503613b5b914c2809ed18f607c`
- Author: Aleksandr Petrov
- Source files: `sas_to_original_items.txt` and
  `sas_to_original_users.txt`

The repository recovers one-to-one mappings between the remapped IDs in the
canonical SASRec MovieLens-1M split and the original MovieLens-1M user/item
IDs. No license file is present in the mapping repository as of the pinned
commit; this project records the exact provenance and checksums in the
generated bundle.

## MovieLens latest display catalog

`data/movie-catalog.js` is a generated transformation of `movies.csv` from
the official MovieLens latest development dataset. It contributes title,
release-year, and genre labels for 3,393 of the 3,416 items in the bundled
ML-1M checkpoints; the 23 IDs absent from that newer catalog retain explicit
ID-only labels. No ratings, tags, users, or poster artwork are included.

MovieLens latest permits redistribution, including transformations, under the
same research-use conditions. Commercial or revenue-bearing use requires
separate permission. The complete source terms are retained at
`licenses/MovieLens-latest-README.txt`.

- Source: https://files.grouplens.org/datasets/movielens/ml-latest.zip
- Source `movies.csv` SHA-256:
  `dd78a76a44b5ff159e66571992bac5208255f86c1a3acbbe7fcd9bbb29d87b3c`
- Recommended citation: F. Maxwell Harper and Joseph A. Konstan. "The
  MovieLens Datasets: History and Context." ACM TiiS 5(4), 2015.

## Exact MovieLens 1M metadata

Movie titles, release years, and genres are read locally from the official
GroupLens `movies.dat` file. The local source convention is
`sasha-playground/data/ml-1m/movies.dat`. This repository does not commit or
redistribute that metadata because the MovieLens-1M usage terms require
separate permission for redistribution.

- Dataset: MovieLens 1M
- Official archive:
  https://files.grouplens.org/datasets/movielens/ml-1m.zip
- Usage terms:
  https://files.grouplens.org/datasets/movielens/ml-1m-README.txt
- Recommended citation: F. Maxwell Harper and Joseph A. Konstan. "The
  MovieLens Datasets: History and Context." ACM TiiS 5(4), 2015.

`presentation/assets/recsys/data/movie-metadata.local.js` is the canonical
generated, gitignored browser cache for the local checkout only.

## Poster links and bundled artwork

The optional local poster URL input used during development is
`REPRO_poster_links.tsv` from the *Binge Watch: Reproducible Multimodal
Benchmarks Datasets for Large-Scale Movie Recommendation on MovieLens-10M and
20M* dataset:

- Dataset record: https://doi.org/10.5281/zenodo.18499145
- Authors: Giuseppe Spillo, Alessandro Petruzzelli, Cataldo Musto, Marco de
  Gemmis, Pasquale Lops, and Giovanni Semeraro
- File: `REPRO_poster_links.tsv`
- File MD5: `d169688e0e65ad9bcdfb100af817103b`
- Dataset license: Creative Commons Attribution 4.0 International

The URL catalog is not committed. The repository does include 3,364 optimized
192 px AVIF thumbnails under `posters/ml1m/avif-w192-q45-v1/`, together with a
manifest recording the URL-catalog hash, current model-mapping hash, 52 missing
IDs, byte totals, and every output hash. The source images were resized to
192 px and encoded as AVIF at quality 45 and effort 6.

The supplemental `posters/ml1m/cold-avif-w192-q45-v1/` release uses the same
user-supplied URL catalog and encoding settings. It adds 126 images for the
151 movies outside the introductory checkpoint catalog, totaling 652,313 bytes.
Its manifest records all 25 missing IDs, source URLs and output hashes. It does
not modify the original 3,364-poster release.

TMDB states that it does not own the underlying artwork, and its API terms
restrict caching, derivatives, and ML/AI-related use. Inclusion in this private
tutorial repository does not itself grant downstream redistribution or
commercial-use rights; confirm the necessary artwork permissions before wider
publication. Rendering falls back to complete text cards if artwork is
unavailable, and model inference never depends on it.

This product uses the TMDB API but is not endorsed or certified by TMDB.
