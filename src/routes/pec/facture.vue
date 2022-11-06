<template>
  <div class=" white-transparent w-full h-full z-50 flex items-center justify-center">
    <div id="paper" class=" bg-white flex flex-col rounded-lg text-black px-12 py-12" > 
    <!-- <div id="paper" class=" bg-white flex flex-col rounded-lg text-black p-12" style="width:595px;height:842">  -->
        <div class=" flex flex-row">
            <div class="flex flex-col"> 
                <span class=" text-xl font-bold">HOPITALY LOTERANA</span> 
                <u class=" mt-2"> Andranomadio - Antsirabe</u> 
                <span class=" mt-2 text-xs">Stat N° 8511 12 200 60 00614</span>  
                <span class=" mt-2 text-xs">NIF N° 20000038126</span>  
                 
                <div class="mt-2">
                    <u class=" font-bold">Patient:</u>
                </div> 
                <div class=" pl-3 rounded-lg py-2 w-96 border border-black">
                    <span  class=" font-bold">RANAIVOMANDRESY ANDRIANTSOAHENRIE</span>
                </div>
            </div>
            <div class="flex flex-col ml-4"> 
                <div class=" px-12 border border-black flex flex-col justify-center items-center">     
                    <span class=" text-xl">ORDONNANCE ET FACTURE</span>  
                    <div class=" text-xl w-full text-center">-- <span>PIRSE EN CHARGE</span> --</div>  
                </div>  
                <div class="mt-4  flex flex-row">     
                    <span class=" px-12  border border-black ">N° 22/0772</span>  
                    <span class=" px-12  border border-black "> 02/04/2022</span> 
                </div>  
                <div class="mt-4">
                    <u class=" font-bold">Société:</u>
                </div> 
                <div class=" pl-3 w-full border py-2 rounded-lg border-black">
                    <span class=" font-bold"> ADEFI</span>
                </div>
            </div>
        </div>
        <div class=" mt-4">            
            <table id="customers">
                <tr>
                    <th>Description des interventions</th>
                    <th>Qté</th>
                    <th>Unité</th>
                    <th>Montnant</th>
                    <th>Part Employé</th>
                    <th>Part Société</th>
                </tr> 
                <tr class=" " >
                    <td>
                        <div class=" flex flex-col mb-7 mt-3">
                            <u class=" font-medium">Dr Elie</u >
                            <li>Prescription de médicaments</li>
                            <li>Soins et traitements divers</li>
                        </div>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr> 
                <tr class=" uppercase  " v-for="i in 7" :key="i">
                    <td class="">
                        <div class=" w-full ml-9 ">Alfreds Futterkiste</div>
                    </td>
                    <td>1</td>
                    <td> </td>
                    <td> 10000</td>
                    <td> 2000</td>
                    <td> 8000</td>
                </tr> 
            </table>
        </div>
    </div>
    <div class=" flex">
        <button @click="export_" class=" right-5 px-4 rounded-lg absolute top-0 outline-none bg-indigo-500 flex item-center">
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
    export_(){
        var doc = new jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: 'a4',
            precision:100,
        });

        doc.html(document.querySelector('#paper'), {
            callback: function (doc) {
                doc.save('file.pdf');
            },
            margin: [10, 10, 10, 10],
            x: 10,
            y: 10, 
            html2canvas: {
                scale: .65,
                allowTaint:true,
            },
        });
    }
}
}
</script>

<style scoped>
.white-transparent{
    background: rgba(15, 15, 15, 0.707);
}

#customers {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  border: 1px solid #ddd;
  width: 100%;
}
#customers th {
  border: 1px solid #ddd;
  padding: 8px;
}
#customers td {
  border-left: 1px solid #ddd;
  padding: 2px;
  font-size: 14px;
}
/* 
#customers tr:nth-child(even){background-color: #f2f2f2;}

#customers tr:hover {background-color: #ddd;} */

#customers th {
  padding: 7px 7px; 
  text-align: left;
  background-color: #868686;
  color: white;
}
 

</style>