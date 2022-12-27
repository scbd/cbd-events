export default function ({ $axios }){
  $axios.onError(error => { console.info(error) })
}