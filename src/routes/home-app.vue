<template>
	<div class="w-full text-gray-600 flex items-center justify-center">
		<div class="flex flex-col w-full">
			<div class="flex justify-center items-center">
				<span class="text-2xl font-bold">Choisissez une application</span>
			</div>
			<div class=""></div>
			<div class="flex flex-wrap justify-center items-center">
				<!-- Pour le patient -->
				<router-link v-if="checkModule('fiche-patient') " 
				:to="{name:'patients'}" class="menu-app">
					<div class="bg-gray-50 p-2 rounded-l flex justify-center items-center">
						<!-- <span class="material-icons text-9xl"> groups </span> -->
						<svg viewBox="0 0 24 24" class=" w-28"><path class=" fill-current text-gray-500" d="M12 5.5A3.5 3.5 0 0 1 15.5 9a3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 8.5 9 3.5 3.5 0 0 1 12 5.5M5 8c.56 0 1.08.15 1.53.42-.15 1.43.27 2.85 1.13 3.96C7.16 13.34 6.16 14 5 14a3 3 0 0 1-3-3 3 3 0 0 1 3-3m14 0a3 3 0 0 1 3 3 3 3 0 0 1-3 3c-1.16 0-2.16-.66-2.66-1.62a5.536 5.536 0 0 0 1.13-3.96c.45-.27.97-.42 1.53-.42M5.5 18.25c0-2.07 2.91-3.75 6.5-3.75s6.5 1.68 6.5 3.75V20h-13v-1.75M0 20v-1.5c0-1.39 1.89-2.56 4.45-2.9-.59.68-.95 1.62-.95 2.65V20H0m24 0h-3.5v-1.75c0-1.03-.36-1.97-.95-2.65 2.56.34 4.45 1.51 4.45 2.9V20z" /></svg>
					</div>
					<div class="flex items-center justify-center">
						<span class="font-bold text-sm m-2"> Gestion patients </span> 
					</div>
				</router-link>
				
				<!-- Pour les caisses -->
				<!-- <router-link :to="{name:'caisse'}" class="menu-app">
					
					<div class="bg-gray-50 p-2 rounded-l">
						<i class="i text-3xl mx-2 ic:baseline-point-of-sale"></i>
					</div>
					<div class="flex flex-col p-1">
						<span class="font-bold text-sm"> Caisse </span> 
					</div>
				</router-link > -->

				<!-- Pour les caisses -->
				<router-link v-if="checkModule('stock')" :to="{name:'stock-fiche'}" class="menu-app">
					
					<div class="bg-gray-50 p-2 rounded-l flex justify-center items-center">
						<!-- <span class="material-icons text-9xl"> inventory </span> -->
						<svg viewBox="0 0 24 24" class=" w-28"><path  class=" fill-current text-gray-500" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m0 16H5V5h14v14m-8-3h-1c-1.61 0-4-1.06-4-4 0-2.93 2.39-4 4-4h1v2h-1c-.46 0-2 .17-2 2 0 1.9 1.67 2 2 2h1v2m3 0h-1v-2h1c.46 0 2-.17 2-2 0-1.9-1.67-2-2-2h-1V8h1c1.61 0 4 1.07 4 4 0 2.94-2.39 4-4 4m1-3H9v-2h6v2z" /></svg>
					</div>
					<div class="flex items-center justify-center">
						<span class="font-bold text-sm m-2"> Stock </span> 
					</div>
				</router-link >

				<!-- Pour les caisses -->
				<router-link v-if="checkModule('prise-en-charge')" :to="{name:'pec-index'}" class="menu-app">
					
					<div class="bg-gray-50 p-2 rounded-l flex justify-center items-center">
						<!-- <span class="material-icons text-9xl"> groups </span> -->
						<svg viewBox="0 0 24 24" class=" w-28"><path  class=" fill-current text-gray-500"  d="M19 6V5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v1h-2V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v1H3v14h11.54A9.55 9.55 0 0 1 13 15.5a5.58 5.58 0 0 1 5.5-5.5 5.3 5.3 0 0 1 2.5.63V6m-2.5 6a3.54 3.54 0 0 0-3.5 3.5c0 2.6 3.5 6.5 3.5 6.5s3.5-3.9 3.5-6.5a3.54 3.54 0 0 0-3.5-3.5m0 4.8a1.2 1.2 0 1 1 0-2.4 1.29 1.29 0 0 1 1.2 1.2 1.15 1.15 0 0 1-1.2 1.2z" /></svg>
					</div>
					<div class="flex items-center justify-center">
						<span class="font-bold text-sm m-2"> Prise en charge </span> 
					</div>
				</router-link >


			</div>	
		</div>
	</div>
</template>

<script>
export default {
	name:"home",
	data(){
		return{

		}
	},
	methods:{
		checkModule(p){
			
			if(this.$store.state.user.util_type == 'm' || this.$store.state.user.util_type == 'a') return true
			// alert('sdfgsdf')

			if(this.$store.state.user.util_type == 'p'){
				return (this.$store.state.ua.indexOf(p) == -1)?false:true
			}
		}
	},

	mounted(){
		console.log(this.$store.state.ua);
	}
}
</script>

<style scoped>
.menu-app{
	@apply flex flex-col border rounded w-64 m-2 cursor-pointer hover:shadow-md hover:border-blue-600 duration-300;

}
</style>