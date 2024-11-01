<template>
  <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorld from "./components/HelloWorld.vue";

export default defineComponent({
  name: "App",
  components: {
    HelloWorld,
  },
});
</script>

<style>
:root {
  --bg-color: rgb(20, 20, 20);
  --g1: rgb(98, 0, 234);
  --g2: rgb(236, 64, 122);
  --g3: rgb(253, 216, 53); 
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color);
  height: 100vh;
  margin: 0px;
  overflow: hidden;
  padding: 0px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
