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
						<span class="material-icons text-9xl"> groups </span>
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
						<span class="material-icons text-9xl"> inventory </span>
					</div>
					<div class="flex items-center justify-center">
						<span class="font-bold text-sm m-2"> Stock </span> 
					</div>
				</router-link >

				<!-- Pour les caisses -->
				<router-link v-if="checkModule('prise-en-charge')" :to="{name:'pec-index'}" class="menu-app">
					
					<div class="bg-gray-50 p-2 rounded-l flex justify-center items-center">
						<span class="material-icons text-9xl"> groups </span>
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