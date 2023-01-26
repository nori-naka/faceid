<script setup>
import { onMounted, provide, ref} from 'vue';
import state from "./store.js";
import VideoPage from "./components/VideoPage.vue";
import InputForm from "./components/InputForm.vue";

const registName = ref("");
const personName = ref("");
const videoPageRef = ref(null);

const onPhoto = () => { videoPageRef.value.registPhoto() }
const onMatch = (name) => { personName.value = name }

provide("state", state);
onMounted(() => {
  state.hello();
  state.set("Nakamura", "Noriaki");
  console.log(state.get("Nakamura"));
})

</script>

<template>

<section class="container">
  <div class="columns is-multiline">
    <div class="column is-8 is-offset-2 register">
      <div class="columns">
        <div class="column left">
          <h1 class="title is-1">WELCOME</h1>
          <h2 class="subtitle colored is-4">顔認識 : {{ personName }}</h2>
          <p>顔が枠に収まる様に映してください</p>
          <VideoPage ref="videoPageRef" :registName="registName" @person="onMatch"></VideoPage>
        </div>
        <InputForm v-model="registName" @onSubmit="onPhoto"></InputForm>
      </div>
    </div>
    <div class="column is-8 is-offset-2">
      <br>
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <span class="icon">
              <i class="fab fa-twitter"></i>
            </span> &emsp;
            <span class="icon">
              <i class="fab fa-facebook"></i>
            </span> &emsp;
            <span class="icon">
              <i class="fab fa-instagram"></i>
            </span> &emsp;
            <span class="icon">
              <i class="fab fa-github"></i>
            </span> &emsp;
            <span class="icon">
              <i class="fas fa-envelope"></i>
            </span>
          </div>
        </div>
        <div class="level-right">
          <small class="level-item" style="color: var(--textLight)">
            &copy; 日本無線でおま.
          </small>
        </div>
      </nav>
    </div>
  </div>
</section>

</template>

<style>
:root {
  --brandColor: hsl(166, 67%, 51%);
  --background: rgb(247, 247, 247);
  --textDark: hsla(0, 0%, 0%, 0.66);
  --textLight: hsla(0, 0%, 0%, 0.33);
}

body {
  background: var(--background);
  height: 100vh;
  color: var(--textDark);
}

.field:not(:last-child) {
  margin-bottom: 1rem;
}

/* Small devices (tabletS) */
@media (min-width: 770px) {
  .register {
    background: white;
    border-radius: 10px;
  }
}

/* Medium devices (desktops) */
@media (min-width: 1024px) {
  .register {
    margin-top: 10rem;
    background: white;
    border-radius: 10px;
  }
}

.left,
.right {
  /* padding: 4.5rem; */
  padding-left: 4.5rem;
  padding-right: 4.5rem;
}

.left {
  border-right: 5px solid var(--background);
}

.left .title {
  font-weight: 800;
  letter-spacing: -2px;
}

.left .colored {
  color: var(--brandColor);
  font-weight: 500;
  margin-top: 1rem !important;
  letter-spacing: -1px;
}

.left p {
  color: var(--textLight);
  font-size: 1.15rem;
}

.right .title {
  font-weight: 800;
  letter-spacing: -1px;
}

.right .description {
  margin-top: 1rem;
  margin-bottom: 1rem !important;
  color: var(--textLight);
  font-size: 1.15rem;
}

.right small {
  color: var(--textLight);
}

input {
  font-size: 1rem;
}

input:focus {
  border-color: var(--brandColor) !important;
  box-shadow: 0 0 0 1px var(--brandColor) !important;
}

.fab,
.fas {
  color: var(--textLight);
  margin-right: 1rem;
}
</style>
