
export default {
  computed: { conference, getHeroImage, getImage, title }
}

function getImage(){
  try{ return this.conference.apps.cbdEvents.image }
  catch(e){ return false }
}

function getHeroImage(){
  try {
    const { cbdEvents } = this.$store.state.conferences.selected.apps

    return cbdEvents.heroImage || this.getImage
  }
  catch(e){ return this.getImage }
}

function conference(){
  try{ return this.$store.state.conferences.selected.app.cbdEvents }
  catch(e){ return {} }
}

function title(){
  try{ return this.$filters.lstring(this.$store.state.conferences.selected.apps.cbdEvents.title) }
  catch(e){ return {} }
}
