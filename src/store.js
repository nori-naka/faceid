import { reactive } from "vue";

function store() {
  const state = reactive({});
  console.log(state)

  state.hello = () => { console.log("hello") };
  state.set = (key, value) => {
    console.log(`KEY=${key} / VALUE=${value}`)
    state[key] = value;
  }
  state.get = (key) => { return state[key] }

  return state
}

const state = store();
export default state;