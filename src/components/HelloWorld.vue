<template>
  <Transition name="fade" v-if="!renderLB">
    <div v-if="!render">
      <Transition>
        <InputText v-if="showUserName()" v-model="userName" placeholder="Enter your name" @input="printName()" class="input" />
      </Transition>
      <div class="title">
        <div class="text" @click="showUserName() ? '' : start()">Start</div>
      </div>
    </div>
    <div v-else class="cards">
      <div class="cards-wrapper" v-for="item in cards" v-bind:key="item.id">
        <div class="card" v-if="count <= item.count"/>
        <div :class="item.class" v-else @mouseover="item.hover = true" >
          <div class="card-content" :class="item.completed ? 'disabled' : 'card-content '" v-if="item.render">
            <p class="card-skip" v-if="item.count == count - 1" @click="increment(item.id)">SKIP</p>
            <p class="card-title">{{item.title}}</p>
            <div v-if="item.hover">
              <p class="card-subtitle">{{item.subtitle}}: {{getName(item.answer)}}</p>
              <div class="skill-row-wrapper">
                <div class="skill-row" v-if="item.id == 0 || item.id == 3">
                  <img v-for="item in item.data" :src="item['icon']" v-bind:key="item">
                </div>
                <div class="skill-row" v-else-if="item.id == 1 || item.id == 2 || item.id == 4">
                  <p class="card-title">{{item.data}}</p>
                </div>
                <div class="skill-row" v-else>
                  <img v-for="item in item.data" :src="item['icon']" v-bind:key="item">
                </div>
              </div>
              <Button :label="item.button" :disabled="item.completed" @click="item.visible = true" icon="pi pi-search" />
            </div>
          </div>
          <div v-else></div>
          <Dialog v-model:visible="item.visible" modal :showHeader="false">
            <div v-if="item.id == 0 || item.id == 3 || item.id == 5">
              <div class="db-header">
                <span class="p-input-icon-left flex">
                  <i class="pi pi-search" />
                  <InputText v-model="filters.battleName.value" placeholder="Search" style="width: 12rem"/>
                </span>
                <SelectButton class="p-selectbutton p-buttonset p-component" v-model="filters.rarity.value" :options="options" @click="printFilter()" />
              </div>
              <DataTable v-if="dbRender()" :selectionMode="item.id == 5 ? 'multiple' : 'single'" dataKey="id" :globalFilterFields="['battleName', 'className', 'rarity']"
              v-model:selection="selectedServant" @click="item.id == 5 ? printAns() : printSel(item.id)" :showHeader="false" :value="item.id == 0 ? easyData : data" v-model:filters="filters">
                <Column v-for="col of columns" :filterField="col.field" :field="col.field" :key="col.field" :header="col.header"/>
              </DataTable>
              <div v-else>
                <h3>{{item.error}}</h3>
              </div>
            </div>
            <div v-else-if="item.id == 1 || item.id == 4">
              <img v-for="item in dialogueData" @click="checkAnswers(item, 3)" :src="item" v-bind:key="item">
            </div>
            <div v-else>
              <span class="command-card" v-for="item in options" v-bind:key="item" style="height: 120px;">
                <img class="command-card-bg">
                <img class="command-card-portrait" >
                <img class="command-card-icon" >
                <img class="command-card-text-card" >
              </span>
              <span class="command-card" style="height: 120px;" @click="checkAnswers('quick', 5)">
                <img class="command-card-bg" src="https://apps.atlasacademy.io/db/assets/card_bg_quick-5afd02f8.png" width="133" height="170">
                <img class="command-card-portrait" :src="'https://static.atlasacademy.io/JP/Servants/Commands/' + getPortrait(item.answer) + '/card_servant_1.png'" width="256" height="256">
                <img class="command-card-icon" src="https://apps.atlasacademy.io/db/assets/card_icon_quick-0d3f5140.png" width="185" height="133">
                <img class="command-card-text-card" src="https://apps.atlasacademy.io/db/assets/card_txt_quick-489437da.png" width="150" height="73">
              </span>
              <span class="command-card" style="height: 120px;" @click="checkAnswers('arts', 5)">
                <img class="command-card-bg" src="https://apps.atlasacademy.io/db/assets/card_bg_arts-0b0f5174.png" width="133" height="170">
                <img class="command-card-portrait" :src="'https://static.atlasacademy.io/JP/Servants/Commands/' + getPortrait(item.answer) + '/card_servant_1.png'" width="256" height="256">
                <img class="command-card-icon" src="https://apps.atlasacademy.io/db/assets/card_icon_arts-7478dae0.png" width="185" height="133">
                <img class="command-card-text-card" src="https://apps.atlasacademy.io/db/assets/card_txt_arts-9a356e8a.png" width="150" height="73">
              </span>
              <span class="command-card" style="height: 120px;" @click="checkAnswers('buster', 5)">
                <img class="command-card-bg" src="https://apps.atlasacademy.io/db/assets/card_bg_buster-7de59e9d.png" width="133" height="170">
                <img class="command-card-portrait" :src="'https://static.atlasacademy.io/JP/Servants/Commands/' + getPortrait(item.answer) + '/card_servant_1.png'" width="256" height="256">
                <img class="command-card-icon" src="https://apps.atlasacademy.io/db/assets/card_icon_buster-7a5c73d3.png" width="185" height="133">
                <img class="command-card-text-card" src="https://apps.atlasacademy.io/db/assets/card_txt_buster-da241d45.png" width="150" height="73">
              </span>
            </div>
          </Dialog>
        </div>
      </div>
      <h1 class="score">{{ getScore() }}</h1>
    </div>
  </Transition>
  <Transition v-else>
  <div @click="render2()">
    <div class="title">
      <div class="text" @click="render = !render">Try again</div>
    </div>
    <DataTable class="datatable-leaderboards" :value="leaderboards" :rows="10" paginator tableStyle="min-width: 50rem">
      <Column
        v-for="col of LBcolumns"
        :field="col.field"
        :key="col.field"
        :header="col.header"
      />
    </DataTable>
  </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import ProductService from "@/service/ProductService";
import {FilterMatchMode, FilterOperator} from 'primevue/api';
interface Card {
  id: number;
  class: string;
  title: string;
  subtitle: string;
  button: string;
  error: string;
  count: number;
  completed: boolean;
  visible: boolean;
  render: boolean;
  hover: boolean;
  data: Array<any>;
  answer: Array<any>;
}
interface Filter {
  global: FilterInt;
  battleName: FilterInt;
  className: FilterInt;
  rarity: FilterInt;
}
interface FilterInt {
  value: string | null | number;
  matchMode: string;
}
export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      show: true,
      temp: [] as any,
      fail: false,
      faceCards: [] as any,
      dialogueData: [] as any,
      selectedProduct: [] as any,
      selectedServant: [] as any,
      filters:{
				global: {value: null, matchMode: FilterMatchMode.CONTAINS} as FilterInt,
				battleName: {value: null, matchMode: FilterMatchMode.CONTAINS} as FilterInt,
				className: {value: null, matchMode: FilterMatchMode.CONTAINS} as FilterInt,
				rarity: {value: null, matchMode: FilterMatchMode.CONTAINS} as FilterInt
			} as Filter,
      cards: [] as Card[],
      options: [1,2,3,4,5],
      value: null,
      userName: '',
      columns: [
        { field: "battleName", header: "Name" },
        { field: "className", header: "Class" },
        { field: "rarity", header: "Rarity" }
      ],
      LBcolumns: [
        { field: "Name", header: "" },
        { field: "Score", header: "" },
        { field: "Combo", header: "" }
      ],
      render: false,
      renderLB: false,
      count: 1,
      score: 0,
      data: [],
      easyData: [] as any,
      leaderboards: [],
      combo: 1,
      highestCombo: 1,
			localStorage: null,
    };
  },
  mounted() {
    ProductService.getAPI().then((response) => {
      this.leaderboards = response.data.results;
    })
    ProductService.getProducts().then(data => {
      this.data = data
    });
    this.populateCards()
  },
  methods: {
    showUserName(){
      return localStorage.getItem('userName') == null ? true : false
    },
    makeEasyData(){
      for(let i = 0; i < 9; i++){
        let j: number = this.getRandomServant(0)
        this.easyData.push(this.data[j])
        j = 0
      }
    },
    printName(){
      this.userName = this.userName.toUpperCase();
      if(this.userName.length == 3){
        localStorage.setItem('userName', this.userName);
        console.log(localStorage.getItem('userName'));
        this.show = false;
      }
    },
    populateCards(){
      this.cards = [
        {id:0, class:"card", title:"Easy", subtitle:"Guess the servant by this skill set", button: "Select a Servant", error:"No Servants", count:0, completed:false, visible:false, render:true, hover:false, data:[], answer:[]},
        {id:1, class:"card", title:"Easy", subtitle:"Remember the skills of this servant", button: "Skills", error:"No Servants", count:1, completed:false, visible:false, render:true, hover:false, data:[], answer:[]},
        {id:2, class:"card", title:"Normal", subtitle:"Remember the cards of this servant", button: "Cards", error:"No Skills", count:2, completed:false, visible:false, render:true, hover:false, data:[], answer:[]},
        {id:3, class:"card", title:"Hard", subtitle:"Guess the servant by this skill set", button: "Select a Servant", error:"No Servants", count:3, completed:false, visible:false, render:true, hover:false, data:[], answer:[]},
        {id:4, class:"card", title:"Hard", subtitle:"Remember the skills of this servant", button: "Skills", error:"No Servants", count:4, completed:false, visible:false, render:true, hover:false, data:[], answer:[]},
        {id:5, class:"card", title:"Very Hard", subtitle:"Choose as many servants with this skill as possible", button: "Select Servants", error:"No Servants", count:5, completed:false, visible:false, render:true, hover:false, data:[], answer:[]}, ] as Card[]
    },
    start(){
      this.render = !this.render
      this.handleGames(this.count)
      this.userName = localStorage.getItem('userName') + ''
    },
    getPortrait(id: any){
      return this.data[id]['id']
    },
    printAns(){
      if(this.selectedServant.length == 5){
        this.cards[5]['visible'] = false
        this.increment(this.count - 1)
      }
      if(this.temp.indexOf(this.selectedServant[this.selectedServant.length - 1]['id']) > -1){
        this.score += 500 * this.combo
        this.combo = this.combo * 2
      }
      else{
        this.fail = true
        this.combo = 1
        this.cards[5]['visible'] = false
        this.increment(this.count - 1)
      }
    },
    checkAnswers(icon: string, qnt: number){
      if(this.selectedProduct.length < qnt){
        this.selectedProduct.push(icon)
      }
      if(this.selectedProduct.length == qnt){
        this.selectedProduct.sort()
        this.temp.sort()
        if(JSON.stringify(this.selectedProduct) == JSON.stringify(this.temp)){
          this.score += 500 * this.combo
          this.combo = this.combo * 2
        }
        else{
          this.fail = true
          this.combo = 1
        }
        this.cards[1]['visible'] = false
        this.cards[2]['visible'] = false
        this.cards[4]['visible'] = false
        this.increment(this.count - 1)
      }
    },
    handleGames(cnt: number){
      let index: any = null
      let obj: any = {}
      let temp: any = []
      switch(cnt) {
        case 1:
          obj = this.getRandomSkills(3)
          this.cards[0].answer = obj.id
          this.cards[0].data = obj.arr
          this.easyData.push(this.data[obj.id])
          this.makeEasyData()
          break
        
        case 2:
          index = this.getRandomServant(0)
          this.cards[1].answer = index
          this.cards[1].data = this.data[index]['battleName']
          temp = this.data[index]['skills']
          temp.forEach((element: any) => {
            this.dialogueData.push(element['icon'])
          });
          this.dialogueData.forEach((element: any) => {
            this.temp.push(element)
          });
          this.getRandomIcons(10)
          this.dialogueData = this.shuffle(this.dialogueData)
          break

        case 3:
          index = this.getRandomServant(1)
          this.cards[2].answer = index
          this.cards[2].data = this.data[index]['battleName']
          temp = this.data[index]['cards']
          temp.forEach((element: any) => {
            this.temp.push(element)
          });
          break

        case 4:
          obj = this.getRandomSkills(3)
          this.cards[3].answer = obj.id
          this.cards[3].data = obj.arr
          break

        case 5:
          this.dialogueData = []
          index = this.getRandomServant(0)
          this.cards[4].answer = index
          this.cards[4].data = this.data[index]['battleName']
          temp = this.data[index]['skills']
          temp.forEach((element: any) => {
            this.dialogueData.push(element['icon'])
          });
          this.dialogueData.forEach((element: any) => {
            this.temp.push(element)
          });
          this.getRandomIcons(30)
          this.dialogueData = this.shuffle(this.dialogueData)
          break

        case 6: //we don't check icons for rank ups here
          obj = this.getRandomSkills(0)
          this.cards[5].answer = obj.id
          this.cards[5].data = obj.arr
          //console.log(obj.arr[0]['icon'])
          this.data.forEach((element: any) => {
            element['skills'].forEach((elem: any) => {
              if(elem['icon'] == obj.arr[0]['icon']){
                this.temp.push(element['id'])
              }
          });
          });
          break
      }
    },
    shuffle(array: any[]){
      let currentIndex = array.length,  randomIndex;
      while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }
      return array;
    },
    getName(id: any){
      return this.data[id]['battleName']
    },
    printSel(id: any){
      let index: any = this.cards[this.count -1]['answer']
      //console.log(this.selectedServant['id'] == this.data[index]['id'] ? true : false)
      if(this.selectedServant['id'] == this.data[index]['id']){
        this.score += 500 * this.combo
        this.combo = this.combo * 2
      }
      else{
        this.fail = true
        this.combo = 1
      }
      this.cards[id]['visible'] = false
      this.increment(id)
    },
    getRandomIcons(qnt: number){
      //let arr: any = []
      for(let i = 0; this.dialogueData.length < qnt; i++){
        const id = this.getRandomServant(0)
        if(this.dialogueData.indexOf(this.data[id]['skills'][0]['icon']) == -1){
          this.dialogueData.push(this.data[id]['skills'][0]['icon'])
        }
      }
      //return arr
    },
    getRandomServant(vol: number){
      const min = Math.ceil(0);
      const max = vol > 0 ? Math.floor(3) : Math.floor(this.data.length);
      return Math.floor(Math.random() * (max - min) + min)
    },
    getRandomSkills(qt: number){
      const id = this.getRandomServant(0)
      //let len: number = Object.keys(this.data[id]['skills']).length
      //let prio = this.data[id]['skills'][len - 1]
      let skillsHighPriority: any[] = []
      const clone: Array<any> = this.data[id]['skills']
      for(let i = 1; i < 4; i++){
        var result = clone.filter(obj => {
          return obj.num == i
        })
        skillsHighPriority.push(result[result.length - 1])
      }
      return {'id': id, 'arr': qt > 1 ? skillsHighPriority : [skillsHighPriority[this.getRandomServant(1)]]}
    },
    printFilter(){
      //console.log('')
    },
    dbRender() {
      if(this.count == 1){
        return true;
      }
      if ((this.filters['battleName'].value === null || this.filters['battleName'].value === '') && this.filters['rarity'].value === null) {
        return false;
      }
      if (this.filters['rarity'].value !== null) {
        return true;
      }
      if (this.filters['battleName'].value !== null || this.filters['battleName'].value !== '') {
        return true;
      }
      if (this.filters['battleName'].value !== null && this.filters['rarity'].value !== null) {
        return true;
      }
      return null;
    },
    render2() {
      this.renderLB = !this.renderLB;
      this.count = 1;
    },
    getScore() {
      return this.score == 0 ? '' : this.score + ' x ' + this.combo; 
    },
    increment(id: number) {
      let exists = false
      this.highestCombo = this.combo > this.highestCombo ? this.combo : this.highestCombo
      this.fail = true
      this.count += 1;
      this.cards[id].class = 'fail'
      this.cards[id].completed = true
      if(this.count > 6){ 
        if(this.fail && this.score > 0){
          ProductService.getAPI().then((response) => {
            this.leaderboards = response.data.results;
          })
          this.leaderboards.forEach((element: any) => {
            if(element['Name'] == this.userName && element['Score'] > this.score){
              exists = true
              ProductService.updateUser(element['objectId'],{
              Name:this.userName,
              Score:this.score,
              Combo:this.highestCombo, })
            }
          });
          if(!exists){
            ProductService.createUser({
            Name:this.userName,
            Score:this.score,
            Combo:this.highestCombo, })
          }
          //this.product.maxLevelApplicable = this.product.maxLevelApplicable ? this.product.maxLevelApplicable : null;
          //this.userName = this.userName == '' ? 'wtf' : localStorage.getItem('userName')
          
          // ProductService.createUser({
          // Name:this.userName,
          // Score:this.score,
          // Combo:this.highestCombo, })
          
          //.then((response) => {console.log(response);}, (error) => {console.log(error);});

          this.reset() 
        //get scores here and see whether this score is bigger than high score in the table
        //then decide to update it, not or create a new one
        }
        else{
          this.reset() 
        }
      }
      this.clearFilters()
      this.selectedProduct = []
      this.selectedServant = []
      this.temp = []
      this.handleGames(this.count)
    },
    reset(){
      this.easyData = []
      this.populateCards()
      this.count = 1
      this.handleGames(this.count)
      this.renderLB = !this.renderLB;
    },
    clearFilters() {
      this.filters = {
				global: {value: null, matchMode: FilterMatchMode.CONTAINS} as FilterInt,
				battleName: {value: null, matchMode: FilterMatchMode.CONTAINS} as FilterInt,
				className: {value: null, matchMode: FilterMatchMode.CONTAINS} as FilterInt,
				rarity: {value: null, matchMode: FilterMatchMode.CONTAINS} as FilterInt
			}
    },
    retrieveTutorials() {
      ProductService.getAPI()
        .then((response) => {
          this.cards[0].data = response.data.results;
        })
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.input{
  position: absolute;
  top: 20%;
  left: calc(50% - 7rem);
  width: 14rem;
}
.disabled {
  opacity: 0.6;
}
.db-header {
  justify-content: space-between;
  display: flex;
  margin-top: 20px;
  margin-bottom: 10px;
}
.p-dialog {
  width: 650px;
}
@media only screen and (max-width: 768px) {
  .p-dialog {
    width: 550px
  }
}
.p-dialog-content {
    border-radius: 10px;
}
.p-disabled, .p-component:disabled {
  opacity: 1;
}
.p-button, .p-button:enabled:hover {
  width: calc(100%);
  background: #ffffff;
  border: 1px solid #ced4da;
  color: #495057;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
  display: inline-block;
}
.skill-row {
  height: 65px;
  margin-bottom: 15px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.skill-row img {
  height: 50px;
}
.card-content {
  padding: 20px;
  position: relative;
  transition: background-position 350ms ease;
  z-index: 2;
  text-align: start;
}
.card-skip {
  position: absolute;
  right: 0px;
  top: 0px;
  font-size: 13px;
  padding: 10px;
  cursor: pointer;
}
.card-title,
.card-subtitle,
.card-skip {
  color: white;
  font-family: "Anek Latin", sans-serif;
  font-weight: 400;
  margin: 0px;
}

.card-title {
  font-size: 3vmin;
  white-space: nowrap;
}

.card-subtitle {
  font-size: 2vh;
  margin-top: 10px;
  height: 50px;
}
.datatable-game{
  background: white;
}
.datatable-leaderboards{
  background: var(--bg-color);
}
.p-datatable .p-datatable-thead > tr > th {
  text-align: left;
  padding: 1rem 1rem;
  border: 1px solid #383838;
  border-width: 0 0 1px 0;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.87);
  transition: box-shadow 0.2s;
}
.p-datatable .p-datatable-tbody > tr {
  background: var(--bg-color);
  color: rgba(255, 255, 255, 0.87);
  transition: box-shadow 0.2s;
}
.p-datatable .p-datatable-tbody > tr > td {
  text-align: left;
  border: 1px solid #383838;
  border-width: 0 0 1px 0;
  padding: 1rem 1rem;
}
.score {
  position: relative;
  left: 20px;
  margin-top: 50px;
  color: #fff;
  user-select: none;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to,
.fade-leave-from {
  opacity: 0;
  height: 0px;
}
.title {
  background: url("https://i.pinimg.com/originals/2b/b5/66/2bb5669f9622a00427c7af13247addb7.jpg")
    center;
}
.text {
  font-size: 15vw;
  font-weight: bold;
  font-family: Roboto, "Helvetica Neue", Arial, sans-serif;
  mix-blend-mode: darken;
  color: #dff0d8;
  background: var(--bg-color);
  user-select: none;
  cursor: pointer;
}
.command-card{
  text-align: center;
  box-sizing: border-box;
  display: inline-block;
  position: relative;
}
.command-card-ratio{
  vertical-align: middle;
  height: 100%;
}
.command-card-bg{
  height: 100%;
  width: auto;
  position: absolute;
  top: 0;
  left: calc(40% / 3.4);
}
.command-card-portrait{
  height: 100%;
  width: auto;
  left: 0;
  top: 0;
  position: relative;
}
.command-card-icon{
  width: auto;
  position: absolute;
  height: calc(calc(133% / 1.85) - 10%);
  left: 10%;
  top: calc(calc(52% / 1.85) + 20%);
  z-index: 1;
}
.command-card-text-card{
  width: auto;
  position: absolute;
  height: calc(calc(73% / 1.5) - 10%);
  left: 10%;
  top: calc(calc(77% / 1.5) + 8.5%);
  z-index: 2;
}
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 922px;
  width: calc(100%-20px);
}
.card {
  background-color: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 260px;
  width: 300px;
  border-radius: 10px;
  position: relative;
}
.fail {
  background-color: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 260px;
  width: 300px;
  border-radius: 10px;
  position: relative;
}
.card:hover:before {
  background-position: 100% 100%;
  transform: scale(1.035, 1.035);
}
.card:before {
  border-radius: 10px;
  background: linear-gradient(
    130deg,
    transparent 0% 33%,
    var(--g1) 66%,
    var(--g2) 83.5%,
    var(--g3) 100%
  );
  background-position: 0% 0%;
  background-size: 300% 300%;
  content: "";
  height: 100%;
  left: 0px;
  pointer-events: none;
  position: absolute;
  top: 0px;
  transition: background-position 475ms ease, transform 475ms ease;
  width: 100%;
  z-index: 1;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
