<template>
    <div :style="input.style">
        <div class="text-xs duration-300 flex items-center font-bold h-4">
            <label :for="id" class="z-10 px-1 text-indigo-600"> {{label}} </label>
        </div>
        <input :autofocus="autofocus" :id="id"   @input="updateInput" ref="cinput"
        :value="modelValue" :type="type"
        class="input-alt w-full duration-300 text-xs" :placeholder="(ex)?ex:label">
    </div>
</template>

<script>
export default {
    props:['label','type','id','autofocus','width','modelValue','ex'],
    data(){

        return{
            on_focus:false,
            style:{
                height:40
            },
            input:{
                style:{},
                model:''
            },

        }
    },
    methods:{
        updateInput(e){
            this.$emit('update:modelValue',e.target.value)
        },
        focusInput(){
            this.$refs.cinput.focus()
        }
    },
    mounted(){
        // if(this.type == 'date'){
        //     console.log(this.modelValue)
        // }
    },
    created(){

    }
}
</script>

<style scoped>

</style>
