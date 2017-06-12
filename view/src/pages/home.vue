<template>
    <div>
        <div class="home page" :class="weatherList.length?'mini-panel':''">
            <div class="over">
                <div class="content">
                    <div class="title">
                        <div>Weatherlab</div>
                        <div>Where weather is started from</div>
                    </div>
                    <form id="search" class="search">
                        <div id="search_load_img"></div>
                        <div class="wrp">
                            <dropdown @onSelect="changeCountry" :counties="country_list"></dropdown>
                            <input-search @onSelect="changeCity" placeholder="Enter city name" :url="searchUrl"></input-search>
                            <input @click.prevent="getWeather" type="submit" value="Search">
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="home map" id="map" ref="map" :style="{display: displayStyle}"></div>

        <div ref="menu" class="home menu" id="menu" :style="{display: displayStyle}">
            <a href="#" class="home" v-scroll-to="'.head'">Home</a>
            <a href="#" v-for="line in weatherList" v-scroll-to="'.list.di-'+line.di">{{line.date}}</a>
        </div>

        <div class="home table" :style="{display: displayStyle}">
            <div class="content">
                <div id="wtable">
                    <div v-for="line in weatherList" class="list" :class="'di-'+line.di" :ref="'di'+line.di">
                        <div class="title">{{line.date}}</div>
                        <div class="wrapp">
                            <span class="block" v-for="block in line.block">
                                <div class="time"><span>{{block.time}}</span></div>
                                <img :src="'/static/img/weather_icon/'+getWeatherStatic(block.weather).icon+'.png'" class="img">
                                <ul class="info">
                                    <li>Temperature: {{block.temp}} &deg;C</li>
                                    <li>Pressure: {{block.pressure}} mm</li>
                                    <li>Humidity: {{block.humidity}}%</li>
                                    <li>Weather: {{getWeatherStatic(block.weather).name}}</li>
                                    <li>Clouds: {{block.clouds}}%</li>
                                    <li>Wind: {{block.wind_speed}} m/s <img class="wind-arrow" :style="getArrowRotate(block.wind_deg)" src="static/img/arrow.png"></li>
                                </ul>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dropdown from '@/components/dropdown'
import inputSearch from '@/components/search'
import Vue from 'vue'
import VueScrollTo from 'vue-scrollto'

Vue.use(VueScrollTo, {
    container: "body",
    duration: 300,
    easing: "ease",
    offset: 0,
    onDone: false,
    onCancel: false
 })

let URL_PATH = 'http://localhost:3000/api/';

export default {
    data () {
        return {
           country_list: [],
           form: {
                country: '',
                city: ''
           },
           weatherList: [],
           displayStyle: 'block',
           month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
           weatherInfoList: []
        }
    },
    methods: {
        getArrowRotate (deg) {
            return 'transform: rotateZ('+deg+'deg)'
        },
        getWeatherStatic (id) {
            let par = {icon:'', name:''}

            let weather = this.weatherInfoList.filter(function(element){
                return element.id == id
            })

            if(weather){
                par.icon = weather[0].img_id
                par.name = weather[0].name
            }

            return par
        },
        changeCountry (value) {
            this.$children[1].searchText = ''
            this.$children[1].$el.children[0].focus()
            this.form.country = value._id
            this.searchUrl = URL_PATH + 'city/'+value._id+'/'
            this.$forceUpdate()
        },
        changeCity (value) {
            if(value){
                this.form.city = value
                this.getWeather()
            }
        },
        getUTCTime(t){
            let time = new Date(t)
            return new Date(time.getTime() + time.getTimezoneOffset() * 60000)
        },
        getWeather () {
            this.$http.get(URL_PATH + 'weather/'+this.form.city)
                .then(res => {
                    let list = res.body.list
                    this.weatherList = []
                    this.$forceUpdate()

                    // start the map
                    let pos = { lat: parseFloat(list.lat), lng: parseFloat(list.lon) }
                    let map = new google.maps.Map(document.getElementById("map"), {
                        zoom: 8,
                        center: pos
                    })
                    let marker = new google.maps.Marker({
                        position: pos,
                        map: map
                    })

                    let pd = -1, di=0;

                    for(let i=0;i<list.list.length;i++){
                        let line = list.list[i], ltime = this.getUTCTime(line.time*1000);

                        if(ltime.getDay()!=pd){
                            this.weatherList.push({
                                date: this.month[ltime.getMonth()]+', '+ltime.getDate(),
                                di: di,
                                block: []
                            })
                            pd=ltime.getDay();
                            di++;
                        }

                        this.weatherList[this.weatherList.length-1].block.push({
                            time: (ltime.getHours()<10?'0':'')+ltime.getHours()+':00',
                            temp: line.temp,
                            pressure: line.pressure,
                            humidity: line.humidity,
                            weather: line.weather,
                            clouds: line.clouds,
                            wind_speed: line.wind_speed,
                            wind_deg: line.wind_deg
                        })
                    }
                })
        }
    },
    components: {
        dropdown,
        inputSearch
    },
    created () {
        this.searchUrl = ''
        this.weatherList = []
        this.$http.get(URL_PATH + 'weather/info').
            then(res => {
                if(!res.body.code){
                    this.weatherInfoList = res.body.list
                }
                else{
                    swal('Oops...','Something went wrong! Try again later.','error')
                    throw Error('getWeatherStatic')
                }
            })
    },
    mounted () {
        this.$http.get(URL_PATH + 'country')
            .then(res => {
                if(!res.body.code){
                    this.country_list = res.body.list
                }
            }, res => {
                swal('Oops...','Something went wrong! Try again later.','error')
                throw Error('getCountryList')
            });

        let map_el=this.$refs.map,
            scroll_menu = this.$refs.menu

        window.onscroll = function(){
            if(!scroll_menu) return false;

            if(window.pageYOffset>=map_el.offsetTop+map_el.offsetHeight+40) scroll_menu.classList = 'home menu float';
            else scroll_menu.classList = 'home menu';
        };
    },
    watch: {
        weatherList (value) {
            if(value && value.length){
                this.displayStyle = 'block'
            }
            else{
                this.displayStyle = 'none'
            }
        }
    }
}
</script>

<style scoped>

</style>