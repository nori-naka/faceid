<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as faceapi from 'face-api.js';
import InputForm from "./InputForm.vue";
import ModalPage from "./ModalPage.vue";

// import img_url from "../assets/nori.png";

const MODEL_URL = "../weights";

// const stream = ref(null);
const videoRef = ref(null);
const canvasRef = ref(null);
const imgRef = ref(null);
const registName = ref("");
const isReady = ref(false);
const loadingMessage = ref("");

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
    video: { width: 360 },
    audio: false
  });
  loadingMessage.value = loadingMessage.value + " / video enable"
  videoRef.value.srcObject = stream;
  await videoRef.value.play();
  canvasRef.value.width = videoRef.value.videoWidth;
  canvasRef.value.height = videoRef.value.videoHeight;
  return stream.value
}

let detection = null;
let faceMatcher = null;
let ctx = null;

const registPhoto = async (name) => {
  console.log(name)
  ctx = canvasRef.value.getContext("2d");
  ctx.drawImage(videoRef.value, 0, 0, canvasRef.value.width, canvasRef.value.height);
  imgRef.value.src = canvasRef.value.toDataURL();
  // canvasRef.value.style.opacity = 0;

  loadingMessage.value = "参照データ作成中"
  isReady.value = false;
  // まずは参照データ
  detection = await faceapi.detectSingleFace(imgRef.value, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks(true).withFaceDescriptor();
  const labeledDescriptor = new faceapi.LabeledFaceDescriptors(name, [detection.descriptor])
  faceMatcher = new faceapi.FaceMatcher(labeledDescriptor, 0.6);
  isReady.value = true;
}

let clearId = null;
onMounted(async() => {
  await loadModels();
  await video_start();
  isReady.value = true;
  const cnt = ref(0);

  setInterval(async () => {

    if (faceMatcher) {
      const detections = await faceapi.detectAllFaces(videoRef.value, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks(true).withFaceDescriptors()

      cnt.value = 0;
      ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
      detections.forEach(fd => {
        const bestMatch = faceMatcher.findBestMatch(fd.descriptor);
        console.log(bestMatch.toString());

        if (bestMatch.label !== "unknown") cnt.value++;

        const box = fd.detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, { label: bestMatch.label });
        drawBox.draw(canvasRef.value);
      })
      console.log(detections);
    }
  }, 500)
})

onUnmounted(() => {
  clearInterval(clearId);
})


</script>
<template>
  <div class="control" style="background: #eee; margin: 100px;">
    <InputForm v-model="registName" @onSubmit="registPhoto"></InputForm>
    <div class="column is-12">
      <div style="position: relative">
        <video ref="videoRef"></video>
        <canvas ref="canvasRef" class="canvasClass"></canvas>
      </div>
      <img ref="imgRef"/>
    </div>
  </div>
  <ModalPage :show="!isReady" :msg="loadingMessage"></ModalPage>
</template>
<style>

.canvasClass {
  position: absolute;
  top: 0px;
  left: 0px;
}
</style>