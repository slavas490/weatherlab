<template>
	<div class="input-search">
		<input @keydown.enter.prevent="selectCity" @keyup="shiftActive" v-model="searchText" type="text" autocomplete="off" :placeholder="placeholder">
		<ul :style="{ display: __isOpen? 'block':'none' }">
			<li v-for="(item, index) in list" @click="changeCity(item)" :class="index==active?'active':''">{{item.name}}</li>
		</ul>
	</div>
</template>

<script>
export default {
	created () {
		this.__isOpen = false
	},
	data () {
		return {
			searchText: "",
			list: [1,2,3],
			active: 0
		}
	},
	methods: {
		shiftActive (event) {
			let key = event.keyCode
			
			if(key==38 && this.active>0){
				this.active--;
			}
			else if(key==40 && this.active<this.list.length-1){
				this.active++;
			}
			else if(key!=13){
				if(this.searchText.length>0){
					this.active = 0;
					this.__isOpen = true
					this.$http.get(this.url+this.searchText)
						.then(res => {
							if(!res.body.code){
								this.list = res.body.list
							}
						})
				}
				else{
					this.__isOpen = false
				}

				this.$forceUpdate()
			}
		},
		changeCity (city){
			this.searchText = city.name
			this.__isOpen = false
			this.list = []
			this.$emit('onSelect', city._id)
			this.$forceUpdate()
		},
		selectCity () {
			if(!this.__isOpen) return false

			let value = this.list[this.active]
			this.changeCity(value)
		}
	},
	props: {
		placeholder: String,
		url: String,
		value: String
	}
}
</script>