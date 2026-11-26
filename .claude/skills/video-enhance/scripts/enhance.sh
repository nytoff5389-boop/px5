#!/usr/bin/env bash
# Video enhancer (ffmpeg): denoise -> upscale -> sharpen -> color/contrast -> optional smooth fps
# Usage: enhance.sh INPUT [OUTPUT] [--preset light|standard|strong] [--height 1080|1440|2160]
#                   [--fps 60] [--deblock] [--crf 18] [--fast]
set -euo pipefail
in="${1:?usage: enhance.sh INPUT [OUTPUT] [options]}"; shift
out=""; [[ $# -gt 0 && "$1" != --* ]] && { out="$1"; shift; }
preset=standard; height=""; fps=""; deblock=0; crf=18; speed=slow
while [[ $# -gt 0 ]]; do case "$1" in
  --preset) preset="$2"; shift 2;; --height) height="$2"; shift 2;;
  --fps) fps="$2"; shift 2;; --deblock) deblock=1; shift;;
  --crf) crf="$2"; shift 2;; --fast) speed=veryfast; shift;;
  *) echo "unknown option $1" >&2; exit 1;; esac; done
[[ -z "$out" ]] && out="${in%.*}_enhanced.mp4"

src_h=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$in")
if [[ -z "$height" ]]; then  # auto: upscale low-res sources x2, cap 2160
  if (( src_h < 720 )); then height=$(( src_h*2 )); elif (( src_h < 1080 )); then height=1080; else height=$src_h; fi
fi
(( height > 2160 )) && height=2160

case "$preset" in
  light)    dn="hqdn3d=1.5:1.5:3:3";            sh="cas=0.4";               eq="eq=contrast=1.02:saturation=1.05";;
  standard) dn="hqdn3d=2.5:2:4:4";              sh="cas=0.6,unsharp=5:5:0.4";  eq="eq=contrast=1.04:saturation=1.08:gamma=1.02";;
  strong)   dn="nlmeans=s=3.5:p=7:r=9";         sh="cas=0.8,unsharp=5:5:0.6";  eq="eq=contrast=1.06:saturation=1.12:gamma=1.03";;
  *) echo "preset must be light|standard|strong" >&2; exit 1;;
esac

vf=""
(( deblock )) && vf="deblock=filter=strong:block=8,"
vf+="$dn"
(( height != src_h )) && vf+=",scale=-2:${height}:flags=lanczos+accurate_rnd+full_chroma_int"
vf+=",$sh,$eq"
[[ -n "$fps" ]] && vf+=",minterpolate=fps=${fps}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1"
vf+=",format=yuv420p"

echo "[enhance] ${src_h}p -> ${height}p | preset=$preset | vf=$vf" >&2
ffmpeg -hide_banner -y -i "$in" -vf "$vf" \
  -c:v libx264 -preset "$speed" -crf "$crf" -tune film -profile:v high \
  -c:a aac -b:a 192k -movflags +faststart "$out"
echo "[enhance] done -> $out" >&2
