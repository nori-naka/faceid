<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
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
  // まずは参照データ
  imgRef.value.onload = createRefData;
  imgRef.value.src = canvasRef.value.toDataURL();
}

const createRefData = async () => {

  console.log(registName.value);

  // detection = await faceapi.detectSingleFace(imgRef.value, new faceapi.TinyFaceDetectorOptions())
  //   .withFaceLandmarks(true).withFaceDescriptor();
  detection = await faceapi.detectSingleFace(canvasRef.value, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks(true).withFaceDescriptor();
  const labeledDescriptor = new faceapi.LabeledFaceDescriptors(registName.value, [detection.descriptor])
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
  const cnt = ref(0);

  setInterval(async () => {

    if (faceMatcher) {
      const detections = await faceapi.detectAllFaces(videoRef.value, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks(true).withFaceDescriptors()

      cnt.value = 0;
      ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
      canvasRef.value.style.width = `${videoRef.value.clientWidth}px`;
      canvasRef.value.style.height = `${videoRef.value.clientHieght}px`;
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
  <div class="content">
    <div class="container is-max-desktop">
      <h1 class="title">顔認識</h1>
      <p class="subtitle">名前を入力して「登録」を押してください</p>
      <InputForm v-model="registName" @onSubmit="registPhoto" @onEnter="registPhoto"></InputForm>
      <div class="columns is-vcentered">
        <div class="column is-half">
          <div style="position: relative">
            <video ref="videoRef"></video>
            <canvas ref="canvasRef" class="is-overlay"></canvas>
          </div>
        </div>
        <div class="column is-half">
          <img class="column" ref="imgRef"/>
        </div>
      </div>
    </div>
  </div>
  <ModalPage :show="!isReady" :msg="loadingMessage"></ModalPage>
</template>
<style>

.absoluteClass {
  position: absolute;
  top: 0px;
  left: 0px;
}
</style>