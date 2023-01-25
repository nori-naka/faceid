<script setup>
import { ref } from "vue";
const props = defineProps(["modelValue"]);
const emits = defineEmits(["update:modelValue", "onSubmit", "onEnter"]);

const registName = ref("")

const onCahnge = (e) => { emits("update:modelValue", registName.value) }
const onSubmit = (e) => { emits("onSubmit", registName.value) }
const onEnter = (e) => {
  if (e.key === "Enter") {
    emits("onSubmit", registName.value);
  }
}

</script>
<template>
  <div class="column right has-text-centered">
    <h1 class="title is-4">ログイン／登録</h1>
    <p class="description">初めてログインされる方は名前を入力して登録を行ってください。</p>
    <div class="field">
      <div class="control">
        <input class="input is-medium" type="text" placeholder="登録者名"  v-model="registName" @change="onCahnge" @keydown.enter="onEnter" />
      </div>
    </div>
    <button class="button is-block is-primary is-fullwidth is-medium" @click="onSubmit">登録</button>
    <br />
    <small><em>マスクは外して登録して下さい.</em></small>
  </div>
</template>

