<template>
	<div class="w-full text-gray-600 flex items-center justify-center bg-white">
		<div class="flex flex-col w-full">
			<div class="flex justify-center items-center">
				<span class="text-2xl font-bold">Choisissez une application</span>
			</div>
			<div class=""></div>
			<div class="flex flex-wrap justify-center items-center">
				<!-- Pour le patient -->
				<router-link v-if="checkModule('fiche-patient') || this.inTypeUser(['a','g','m']) " 
				:to="{name:'patients'}" class="menu-app">
					<div class="bg-gray-50 p-2 rounded-l flex justify-center items-center">
						<span class="material-icons text-9xl"> groups </span>
					</div>
					<div class="flex items-center justify-center">
						<span class="font-bold text-sm m-2"> Patients </span> 
					</div>
				</router-link>
				
				<!-- Pour les caisses -->
				<router-link v-if="checkModule('caisse-main') || checkModule('caisse-disp') || this.inTypeUser(['a','g','m'])" 
				:to="{name:((checkModule('caisse-main') || inTypeUser(['a','g','m']) )?'caisse-main':'caisse-disp')}" class="menu-app">
					
					<div class="bg-gray-50 p-2 rounded-l flex justify-center items-center">
						<span class="material-icons text-9xl"> point_of_sale </span>
					</div>
					<div class="flex items-center justify-center">
						<span class="font-bold text-sm m-2"> Caisse</span> 
					</div>
				</router-link >

				<!-- Pour les caisses -->
				<router-link v-if="checkModule('stock') || this.inTypeUser(['a','g','m'])" :to="{name:'stock-fiche'}" class="menu-app">
					
					<div class="bg-gray-50 p-2 rounded-l flex justify-center items-center">
						<span class="material-icons text-9xl"> inventory </span>
					</div>
					<div class="flex items-center justify-center">
						<span class="font-bold text-sm m-2"> Stock </span> 
					</div>
				</router-link >

				<!-- Pour les caisses -->
				<router-link v-if="checkModule('prise-en-charge') || this.inTypeUser(['a','g','m'])" :to="{name:'pec-index'}" class="menu-app">
					
					<div class="bg-gray-50 p-2 rounded-l flex justify-center items-center">
						<span class="material-icons text-9xl"> groups </span>
					</div>
					<div class="flex items-center justify-center">
						<span class="font-bold text-sm m-2"> Prise en Charge </span> 
					</div>
				</router-link >

				<!-- Pour les caisses -->
				<router-link v-if="inTypeUser(['g','a','m'])" :to="{name:'tarif-service'}" class="menu-app">
					
					<div class="bg-gray-50 p-2 rounded-l flex justify-center items-center">
						<span class="material-icons text-9xl"> groups </span>
					</div>
					<div class="flex items-center justify-center">
						<span class="font-bold text-sm m-2"> Tarification </span> 
					</div>
				</router-link>

				<!-- Pour les caisses -->
				<router-link v-if="inTypeUser(['g','a','m']) || checkModule('facturation')"  :to="{name:'hosp'}" class="menu-app">
					
					<div class="bg-gray-50 p-2 rounded-l flex justify-center items-center">
						<span class="material-icons text-9xl"> healing </span>
					</div>
					<div class="flex items-center justify-center">
						<span class="font-bold text-sm m-2"> Facturation </span> 
					</div>
				</router-link>
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
		
	},

	mounted(){
		// alert('Salut')
		console.log(this.$http.defaults.baseURL)

		window.electronAPI.setTitle("Med HLA - Home")

		// console.log(this.$store.state.ua);
	}
}
</script>

<style scoped>
.menu-app{
	@apply flex flex-col border rounded w-64 m-2 cursor-pointer hover:shadow-md hover:border-blue-600 duration-300;

}
</style>