<script setup>
import { ref, onMounted, onUnmounted, computed, inject } from "vue";
import * as faceapi from 'face-api.js';
// import InputForm from "./InputForm.vue";
import ModalPage from "./ModalPage.vue";

const MODEL_URL = "../weights";

// const stream = ref(null);
const videoRef = ref(null);
const canvasRef = ref(null);
const isReady = ref(false);
const loadingMessage = ref("");

const props = defineProps(["registName"])
const emits = defineEmits(["person"]);

const loadModels = async () => {
	console.log("loadModels");
  loadingMessage.value = "モデルローディング中"

	return Promise.all([
    // faceapi.loadSsdMobilenetv1Model(MODEL_URL),
    faceapi.loadTinyFaceDetectorModel(MODEL_URL),
    // faceapi.loadMtcnnModel(MODEL_URL),
    // faceapi.loadFaceLandmarkModel(MODEL_URL),
    faceapi.loadFaceLandmarkTinyModel(MODEL_URL),
    faceapi.loadFaceRecognitionModel(MODEL_URL),
    // faceapi.loadFaceExpressionModel(MODEL_URL),
	])
}

const video_start = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {width: 640},
    audio: false
  });
  loadingMessage.value = loadingMessage.value + " / video enable"
  videoRef.value.srcObject = stream;
  await videoRef.value.play();

  return stream.value
}

let detection = null;
let faceMatcher = null;
let ctx = null;

const registPhoto = async () => {
  isReady.value = false;

  ctx = canvasRef.value.getContext("2d");
  canvasRef.value.width = videoRef.value.videoWidth;
  canvasRef.value.height = videoRef.value.videoHeight;
  ctx.drawImage(videoRef.value, 0, 0, canvasRef.value.width, canvasRef.value.height);

  loadingMessage.value = "参照データ作成中"
  createRefData();
}

const createRefData = async () => {

  console.log(props.registName);

  detection = await faceapi.detectSingleFace(canvasRef.value, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks(true).withFaceDescriptor();
  const labeledDescriptor = new faceapi.LabeledFaceDescriptors(props.registName, [detection.descriptor])
  faceMatcher = new faceapi.FaceMatcher(labeledDescriptor, 0.6);
  console.log("参照データ完了")
  isReady.value = true;
}

let clearId = null;
onMounted(async() => {
  await loadModels();
  console.log("loadModels ended...");
  await video_start();
  isReady.value = true;

  setInterval(async () => {
    if (faceMatcher) {
      const detections = await faceapi.detectAllFaces(videoRef.value, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks(true).withFaceDescriptors()

      ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
      canvasRef.value.style.width = `${videoRef.value.clientWidth}px`;
      canvasRef.value.style.height = `${videoRef.value.clientHieght}px`;
      detections.forEach(fd => {

        // console.log(JSON.stringify(fd));
        const bestMatch = faceMatcher.findBestMatch(fd.descriptor);
        console.log(bestMatch.toString());
        if (bestMatch.distance < 0.6) {
          emits("person", bestMatch.label);
        }
        const box = fd.detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, { label: bestMatch.label });
        drawBox.draw(canvasRef.value);
      })
      console.log(detections);
      if (detections.length === 0) {
        emits("person", "");
      }
    }
  }, 500)
})

onUnmounted(() => {
  clearInterval(clearId);
})

defineExpose({
  registPhoto,
})

</script>

<template>
  <div class="box">
    <div class="box">
      <video ref="videoRef"></video>
      <canvas ref="canvasRef" class="is-overlay is-100"></canvas>
    </div>
  </div>
  <ModalPage :show="!isReady" :msg="loadingMessage"></ModalPage>
</template>

<style scoped>
.box {
  position: relative;
  padding: 0px;
}
.is-100 {
  width: 100%;
}
</style>
