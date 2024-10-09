import { DateTime } from 'luxon'
import   Vue        from 'vue'

export default class {
  constructor($i18n, weekDateTime){
    this._initI18n($i18n)

    Vue.set(this, 'iterations', [])
    this.weekIterations(weekDateTime)
    this.loading = false
  }

  _initI18n($i18n){
    this.locale = $i18n.locale
    this.$i18n  = $i18n
  }

  get selected(){
    for (let i = 0; i < 15; i++)
      this.iterations[i].loading = this.loading

    return this.iterations[7]
  }

  weekIterations(weekDateTime){
    weekDateTime.setLocale(this.locale)

    this.weekDateTime  = weekDateTime.startOf('week') 
    this.startWeek     = weekDateTime.minus({ weeks: 7 }).startOf('week')
    this.endWeek       = weekDateTime.plus({ weeks: 7 }).startOf('week')

    for (let i = 0; i < 15; i++){
      const nw = {
        prev     : this.iterations[i-1],
        aDateTime: this.startWeek.plus({ weeks: i }),
        i18n     : this.$i18n
      }

      this.iterations[i] = new Week(nw)
    }
    for (let i = 0; i < 15; i++)
      this.iterations[i].next = this.iterations[i+1]
  }

  add(number){
    if(number<0) this._fromRight(number)
    if(number>0) this._fromLeft(number)
  }

  setLocale(){
    for (let i = 0; i < this.iterations.length; i++)
      this.iterations[i].setI18n(this.i18n)
  }


  _fromLeft(number){
    this.loading = true
    for (let i = 0; i < number; i++){
      const nw = {
        prev     : null,
        aDateTime: this.iterations[0].startDateTime.minus({ weeks: 1 }).startOf('week'),
        next     : this.iterations[0],
        i18n     : this.$i18n
      }
      const newWeek = new Week(nw)

      this.iterations[0].prev =  newWeek
      setTimeout(() => {
        Vue.nextTick(() => this.iterations.pop())
      }, 400);
      this.iterations.unshift(newWeek)
    }
  }

  _fromRight(number){
    this.loading = true
    number = number*-1
    for (let i = 0; i < number; i++){
      const nw = {
        prev     : this.iterations[14],
        aDateTime: this.iterations[14].startDateTime.plus({ weeks: 1 }).startOf('week'),
        next     : null,
        i18n     : this.$i18n
      }
      const newWeek = new Week(nw)

      this.iterations[14].next = newWeek
      this.iterations.push(newWeek)
      setTimeout(() => {
        Vue.nextTick(() => this.iterations.shift())
      }, 400)
    }
  }
}

class Week{
  constructor(params){
    const { aDateTime, next, prev, i18n }    = params

    this.type       = 'week'
    this.aDateTime  = aDateTime
    this.$i18n      = i18n
    this.loading    = false
    this.nextTick   = next
    this.prev       = prev
    this._initDayIterarions()
  }
  setI18n(i18n){
    this.$i18n = i18n
    this._initDayIterarions()
  }
  get weekNumber(){
    return this.aDateTime.setLocale(this.$i18n.locale).weekNumber
  }
  get year(){
    return this.aDateTime.setLocale(this.$i18n.locale).toFormat('yyyy')
  }
  get startDateTime(){
    return this.aDateTime.setLocale(this.$i18n.locale).startOf('week')
  }
  get startMon (){
    return this.startDateTime.setLocale(this.$i18n.locale).toFormat('MMM')
  }
  get startMonth (){
    return this.startDateTime.setLocale(this.$i18n.locale).toFormat('MMMM')
  }
  get startDay (){
    return this.startDateTime.setLocale(this.$i18n.locale).day
  }
  get endDateTime (){
    return this.startDateTime.setLocale(this.$i18n.locale).endOf('week')
  }
  get endMon (){
    if(this.startMon === this.endDateTime.setLocale(this.$i18n.locale).toFormat('MMM'))
      return ''
    return this.endDateTime.setLocale(this.$i18n.locale).toFormat('MMM')
  }
  get endMonth (){
    if(this.startMonth === this.endDateTime.setLocale(this.$i18n.locale).toFormat('MMMM'))
      return ''
    return this.endDateTime.setLocale(this.$i18n.locale).toFormat('MMMM')
  }
  get endDay (){
    return this.endDateTime.setLocale(this.$i18n.locale).day
  }
  get title (){
    return `${this.startMon} ${this.startDay} - ${this.endMon} ${this.endDay}`
  }
  get subTitle (){
    return `${this.year} (${this.$i18n.t('week')} ${this.weekNumber})`
  }
  _initDayIterarions (){
    if(!this.dayIterarions)this.dayIterarions=[]

    for (let i = 0; i < 7; i++){
      const aDateTime = this.startDateTime.plus({ day: i }).startOf('day')

      this.dayIterarions[i] = { aDateTime,
        title    : aDateTime.day,
        subTitle : `${aDateTime.setLocale(this.$i18n.locale).toFormat('MMM')}`,
        isWeekend: this._isWeekend(aDateTime),
        isToday  : this._isToday(aDateTime) }
    }
    return this.dayIterarions
  }
  _isWeekend (aDateTime){
    if(aDateTime.toFormat('c')==='1' || aDateTime.toFormat('c')==='7')
      return true
    return false
  }
  _isToday (aDateTime){
    return (aDateTime.startOf('day').valueOf()==DateTime.local().startOf('day').valueOf())
  }
}
