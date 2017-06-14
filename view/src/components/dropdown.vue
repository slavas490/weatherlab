<template>
	<div @click="toggle" class="dropdown" :class=" __isOpen? 'open' : '' " name="country">
		<span class="text">
			<span class="title-span">
				<div v-show="selected" class="flag" :class="selected?'flag-'+selected.name.toLowerCase():''"></div> {{selected.name}}
			</span>
		</span>
		<input ref="input" :style="{ width: __style.input.width }" type="text" @keydown.enter.prevent="selectCountry" v-model="countryFilter" class="srch">
        <ul :style="{ width: __style.list.width }">
            <li v-for="country in countryList" :value="country" @click="changeCountry(country)">
            	<div :class="country?'flag-'+country.name.toLowerCase():''" class="flag"></div> {{country.name}}
        	</li>
        </ul>
    </div>
</template>

<script>
export default {
	created () {
		this.__isOpen = false
		this.__style = {
			input: {
				width: "0px"
			},
			list: {
				width: "0px"
			}
		}

		window.addEventListener('click', (event)=>{
			this.hide(event);
		})

		window.addEventListener('resize', ()=>{
			this.resize()
		})
	},
	mounted () {
		this.resize()
	},
	data () {
		return {
			countryFilter: "",
			selected: "",
			countryList: []
		}
	},
	methods: {
		hide () {
			if(this.__isOpen){
				this.__isOpen = false
				this.$forceUpdate()
			}
		},
		toggle (event) {
			event.stopPropagation();

			let classname = event.target.className
			
			if(!classname.includes('srch')){
				this.__isOpen = !this.__isOpen
			}

			this.$forceUpdate()

			this.$nextTick(() => {
				this.$refs.input.focus()
			})
		},
		changeCountry (country) {
			this.selected = country
			this.countryFilter = ""
			this.$emit('onSelect', country)
		},
		selectCountry (event) {
			if(this.countryList.length){
				this.changeCountry(this.countryList[0])
			}
			else{
				swal('Oops...','Sorry, but your country not found!','error')
				this.countryFilter = ''
			}
			this.__isOpen = false
		},
		resize () {
			let width = this.$el.offsetWidth

			this.__style.input.width = (width-30) + "px";
			this.__style.list.width = width + "px";
		}
	},
	props: {
		counties: Array
	},
	watch: {
		counties (newVal) {
			if(newVal){
				this.countryList = newVal
				this.selected = newVal[0]
				this.changeCountry(newVal[0])
			}
		},
		countryFilter (text) {
			if(text.length>=1){
				this.countryList = [];

				this.counties.forEach((element)=>{
					if(new RegExp(text, 'i').test(element.name)){
						this.countryList.push(element)
					}
				})
			}
			else{
				this.countryList = this.counties
			}
		}
	}
}
</script>