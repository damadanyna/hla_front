<template>
    <div style="z-index: 2000;" class="flex w-full flex-column mr-2 relative" >
        <InputText  :style="style" @focus="on_search = true" @blur="blurVar()" class="p-inputtext-sm w-full" type="text" :value="modelValue"
            @input="changeInput" :placeholder="placeholder"/>

        <div  v-if="on_search" :class="(on_quit)?'fadeout animation-duration-300':'fadein'" class="shadow-6  flex flex-column absolute border-round bg-white border-1 border-200 w-full " 
        style="top:42px;z-index: 2000;"   >
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props:['placeholder','modelValue','width'],
    data(){
        return{

            //pour la gestion de recherche avec suggextion
            on_search:false,
            on_quit:false,
            search:'',
            style:{}
        }
    },
    methods:{
        blurVar(){
            this.on_quit = true
            setTimeout(() => {
                this.on_search = false
                this.on_quit = false
            }, 200);
        },
        changeInput($event){
            //console.log("Changemedent custom de l'input");
            this.$emit('update:modelValue',$event.target.value)
        }
    },
    beforeMount(){
        // console.log(this.placeholder,this.modelValue)
        this.style.width = (!this.width)?'400px':`${this.width}px`
    }
}
</script>