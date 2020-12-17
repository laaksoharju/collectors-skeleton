<template>
  <div>
    <button class="button" @click="showModal = true">Demo</button>
    <transition name="fade" appear>
      <div
        class="modal-overlay"
        v-if="showModal"
        @click="showModal = false"
      ></div>
    </transition>
    <transition name="slide" appear>
      <div class="modal-d" v-if="showModal">
        <h1>Demo</h1>
        
        <div class="demoContent" v-if="slide==1">
          <p>1</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure ipsum
            perspiciatis cupiditate quas ad, saepe praesentium officiis dolore
            neque distinctio!
          </p>
        </div>

        <div class="demoContent" v-if="slide==2">
          <p>2</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure ipsum
            perspiciatis cupiditate quas ad, saepe praesentium officiis dolore
            neque distinctio!
          </p>
        </div>

        <div class="buttonContainer">
          <button class="smallButton" @click="prevSlide">Back</button>
          <button class="smallButton" @click="nextSlide">Forward</button>
          <button class="smallButton red" @click="showModal = false">
            Close
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>


<script>
export default {
  name: "DemoButton",
  data: function () {
    return {
      showModal: false,
      slide: 1
    };
  },

  methods: {
    nextSlide: function () {
      this.slide +=1
    },

    prevSlide: function () {
      this.slide -=1
    }
  }
};
</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "monserrat", sans-serif;
}

#app {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  overflow: hidden;
}

.button {
  appearance: none;
  outline: none;
  border: none;
  background: none;
  cursor: pointer;
  display: inline-block;
  padding: 15px 25px;
  background-image: linear-gradient(to right, gray, black);
  border-radius: 8px;
  color: #fff;
  font-weight: 700;
  box-shadow: 3px 3px rgba(0, 0, 0, 0.3);
  transition: 0.4s ease-out;
}

.button:hover {
  box-shadow: 6px 6px rgba(0, 0, 0, 0.6);
}

.smallButton {
  appearance: none;
  outline: none;
  border: none;
  background: none;
  cursor: pointer;
  display: inline-block;
  padding: 5px 10px;
  background-image: linear-gradient(to right, gray, black);
  border-radius: 8px;
  color: #fff;
  font-weight: 700;
  box-shadow: 0.5px 0.5px rgba(0, 0, 0, 0.4);
  transition: 0.2s ease-out;
  margin-left: 10px;
}

.smallButton:hover {
  box-shadow: 1px 1px rgba(0, 0, 0, 0.6);
}

.buttonContainer {
  margin: auto;
}

.red {
  background-image: linear-gradient(to right, #cc2e50, #ff5858);
  margin-left: 35%;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  bottom: 0;
  z-index: 98;
  background-color: rgba(0, 0, 0, 0.95);
}

.modal-d {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;

  width: 100vw;
  max-width: 700px;
  /* min-height: 200px; */
  background-color: #fff;
  padding: 25px;
  border-radius: 8px;
}

.demoContent {
  min-height: 500px;
}

h1 {
  color: #222;
  font-size: 32px;
  font-weight: 900;
  margin-bottom: 15px;
}

p {
  color: #666;
  font-size: 18px;
  font-weight: 400;
  margin-bottom: 15px;
}

.fade-enter-active,
.fade-leave.active {
  transition: opacity 1.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave.active {
  transition: transform 0.5s;
}

.slide-enter,
.slide-leave-to {
  transform: translateY(70%) translateX(100vw);
}
</style>