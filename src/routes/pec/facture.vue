<template>
  <div id="content" class=" white-transparent w-full h-full z-50 flex items-center justify-center">
    <div id="paper" class=" bg-white petit_ flex flex-col rounded-lg text-black p-12" style="width:595px"> 
    <!-- <div id="paper" class=" bg-white flex flex-col rounded-lg text-black p-12" style="width:595px;height:842">  -->
        <div class=" flex flex-row w-full">
            <div class="flex flex-col " style=" width:100%"> 
                <pre class="  font-bold text-base">HOPITALY LOTERANA</pre> 
                <u class=" mt-2"> Andranomadio - Antsirabe</u> 
                <span class=" mt-2">Stat N° 8511 12 200 60 00614</span>  
                <span class=" mt-2">NIF N° 20000038126</span>  
                 
                <div class="mt-2">
                    <u class=" font-bold">Patient:</u>
                </div>  
                <div class="flex flex-col w-full mt-3">
                    <span class=" font-bold px-3  pb-3 w-full border rounded-lg border-black"  style="font-size: 7px;"> RANAIVOMANDRESY ANDRIANTSOAHENRIE</span>
                </div> 
            </div>
            <div class="flex flex-col ml-4 " style=" width:60%"> 
                <div class="  border border-black flex flex-col w-full text-center">     
                    <pre  style="font-size: 9px;">ORDONNANCE  ET FACTURE</pre>  
                    <pre class="  text-center w-full  pb-3"  style="font-size: 9px;">##  PIRSE EN CHARGE  ##</pre>  
                </div>  
                <div class="mt-4  flex flex-row">     
                    <span class="  pb-2  border border-black w-full pl-3">N° 22/0772</span>  
                    <span class="  pb-2  border border-black w-full pl-3"> 02/04/2022</span> 
                </div>  
                <div class="mt-4">
                    <u class=" font-bold">Société:</u>
                </div> 
                <div class="flex flex-col w-full mt-3">
                    <span class=" font-bold px-3  pb-3 w-full border rounded-lg border-black"  style="font-size: 7px;"> ADEFI</span>
                </div>
            </div>
        </div>
        <div class=" mt-4">            
            <table id="customers"  >
                <tr>
                    <th  class="border_th">Description des interventions</th>
                    <th  class="border_th">Qté</th>
                    <th  class="border_th">Unité</th>
                    <th  class="border_th">Montnant</th>
                    <th  class="border_th">Part Employé</th>
                    <th  class="border_th">Part Société</th>
                </tr> 
                <tr class=" " >
                    <td class="border_td">
                        <div class=" flex flex-col mb-7 mt-3">
                            <u class=" font-medium">Dr Elie</u >
                            <div class="" style="font-size: 9px;"> - Prescription de médicaments</div>
                            <div style="font-size: 9px;"> - Soins et traitements divers</div>
                        </div>
                    </td>
                    <td class="border_td"></td>
                    <td class="border_td"></td>
                    <td class="border_td"></td>
                    <td class="border_td"></td>
                    <td class="border_td"></td>
                </tr> 
                <tr v-for="i in 7" :key="i">
                    <td class="border_td" >
                        <div class="  ml-9 " style="font-size: 9px;">Alfreds Futterkiste</div>
                    </td>
                    <td class="border_td" style="font-size: 9px;">1</td>
                    <td class="border_td" style="font-size: 9px;"> </td>
                    <td class="border_td" style="font-size: 9px;"> 10000</td>
                    <td class="border_td" style="font-size: 9px;"> 2000</td>
                    <td class="border_td" style="font-size: 9px;"> 8000</td>
                </tr>  
                <tr class=" " >
                    <td class="border_td"> 
                    </td>
                    <td class="border_td"></td>
                    <td class="border_td"></td>
                    <td class="border_td"></td>
                    <td class="border_td"></td>
                    <td class="border_td"></td>
                </tr> 
                <tr class=" border-t border-gray-400" > 
                    <td colspan="2" ></td>
                    <td class="tot border_td pb-3" style=" font-size:10px">TOTAL</td>
                    <td class="tot border_td pb-3" style=" font-size:10px">10000</td>
                    <td class="tot border_td pb-3" style=" font-size:10px">300000</td>
                    <td class="tot border_td pb-3" style=" font-size:10px">600000</td>
                </tr> 
            </table>
        </div>
        <div class=" w-full flex justify-between mt-3">
            <span style="padding-bottom:2px;" class=" border-b border-black font-semibold">Le Medecin</span>
            <span style="padding-bottom:2px;" class=" border-b border-black font-semibold">Le Patient</span>
            <span style="padding-bottom:2px;" class=" border-b border-black font-semibold">La Société</span>
        </div>
    </div>
    <div class=" flex">
        <button @click="export_('#paper')" class=" right-5 px-4 rounded-lg absolute top-0 outline-none bg-indigo-500 flex item-center">
            <svg class="  w-7" viewBox=" 0 0 24 24"><path class=" fill-current text-gray-100" d="M18 3H6v4h12m1 5a1 1 0 0 1-1-1 1 1 0 0 1 1-1 1 1 0 0 1 1 1 1 1 0 0 1-1 1m-3 7H8v-5h8m3-6H5a3 3 0 0 0-3 3v6h4v4h12v-4h4v-6a3 3 0 0 0-3-3z" /></svg>
            <span class=" text-gray-100">PDF</span>
        </button>
    </div>
</div>
</template>

<script>
import jsPDF from 'jspdf' 
export default {
    methods:{  
    export_(dom){  
        this.$store.commit('export_pdf',dom); 
    },
}
}
</script>

<style scoped>
.white-transparent{
    background: rgba(15, 15, 15, 0.707);
}  table td, table th {
    font-size: 9px;
    
    }
.petit_{
    font-size: 9px;
}

#customers {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  border-right: 1px solid #ddd;
  width: 100%;
}
.border_th{
  border: 1px solid #ddd;
  padding: 8px;
}
.border_td {
  border-left: 1px solid #ddd; 
  padding: 2px;
  font-size: 14px;
}
/* 
#customers tr:nth-child(even){background-color: #f2f2f2;}

#customers tr:hover {background-color: #ddd;} */

#customers th,.tot {
  padding: 7px 7px; 
  text-align: left;
  background-color: #868686;
  color: white;
}
 

</style>