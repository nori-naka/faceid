<script setup>
import { ref } from "vue";
const props = defineProps(["modelValue"]);
const emits = defineEmits(["update:modelValue", "onSubmit", "onEnter"]);

const registName = ref("")

const onCahnge = (e) => { emits("update:modelValue", registName.value) }
const onSubmit = (e) => { emits("onSubmit", registName.value) }
const onEnter = (e) => {
  if (e.key === "Enter") {
    emits("onEnter", registName.value);
  }
}

</script>
<template>
  <div class="field has-addons">
    <div class="control">
      <input class="input" type="text" placeholder="登録者名" v-model="registName" @change="onCahnge" @keydown.enter="onEnter">
    </div>
    <div class="control">
      <a class="button is-success" @click="onSubmit">登録</a>
    </div>
  </div>
</template>