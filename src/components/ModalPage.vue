<script setup>
const props = defineProps(["show", "msg"]);

</script>
<template>
  <div class="modal" :class="{'is-active': show}">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <p>Now Loading ... {{ msg }}</p>
        <!-- Your content -->
      </div>
    </div>
  </div>
</template>