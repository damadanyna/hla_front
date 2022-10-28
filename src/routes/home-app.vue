<template>
	<div class="w-full text-gray-600 flex items-center justify-center">
		<div class="flex flex-col w-full">
			<div class="flex justify-center items-center">
				<span class="text-2xl font-bold">Choississez une application</span>
			</div>
			<div class=""></div>
			<div class="flex flex-wrap justify-center items-center">

				<!-- Pour le patient -->
				<router-link :to="{name:'patients'}" class="menu-app">
					<div class="bg-gray-50 p-2 rounded-l">
						<i class="i w-12 mx-2 ic:baseline-groups"></i>
					</div>
					<div class="flex flex-col p-1">
						<span class="font-bold text-sm"> Gestion Patients </span>
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
				<!-- <router-link :to="{name:'stock-fiche'}" class="menu-app">
					
					<div class="bg-gray-50 p-2 rounded-l">
						<i class="i text-3xl mx-2 ic:baseline-inventory"></i>
					</div>
					<div class="flex flex-col p-1">
						<span class="font-bold text-sm"> Stock </span> 
					</div>
				</router-link > -->

				<!-- Pour les caisses -->
				<router-link :to="{name:'pec-index'}" class="menu-app">
					
					<div class="bg-gray-50 p-2 rounded-l">
						<i class="i text-3xl mx-2 ic:baseline-groups "></i>
					</div>
					<div class="flex flex-col p-1">
						<span class="font-bold text-sm"> Prise en charge </span> 
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
	}
}
</script>

<style scoped>
.menu-app{
	@apply flex border rounded w-64 m-2 cursor-pointer hover:shadow-md hover:border-blue-600 duration-300;

}
</style>