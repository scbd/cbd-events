export default function ({ $axios, redirect }) {
  $axios.onError(error => {
    console.info(error)
  })
}
