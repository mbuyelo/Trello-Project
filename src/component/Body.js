import React, { Component } from 'react'
import Activityboard from './Activityboard';
import Banner from './Banner';
import AddListModal from './AddListModal';
const trelloData = require('../mytrello.json');
let data = trelloData;
export default class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trello: trelloData,
      openModal: false
    }
    this.onDropEvent = this.onDropEvent.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.createNewList = this.createNewList.bind(this);
    this.createNewCard = this.createNewCard.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
    this.updateCard = this.updateCard.bind(this);
    this.deleteList = this.deleteList.bind(this);
  }
  onDropEvent(e, id) {
    let targetId = e.dataTransfer.getData("id");
    let task = {};
    let testPass = false;
    for (let key in data) {
      if (testPass) {
        break;
      } else {
        for (let i = 0; i < data[key].length; i++) {
          if (parseInt(data[key][i].id) === parseInt(targetId)) {
            task = data[key][i];
            data[key].splice([i], 1);
            testPass = true;
            break;
          }
        }
      }
    }
    this.updateBoard(task, id);
  }
  updateBoard(task, id){
    if(task.id !== undefined) {
      for(let key in data) {
        if (key === id) {
          data[key].unshift(task);
          break;
        }
      }
      this.setState({
        trello: data
      })
    }
  }
  createNewCard(desc, id){
    for(let key in data) {
      if (key === id) {
        data[key].unshift(desc);
        break;
      }
    }
    this.setState({
      trello: data
    })
  }
  updateCard(desc, id){
    for(let key in data) {
      if (key === id) {
        for(let i=0; i<data[key].length; i++){
          if(parseInt(data[key][i].id) === parseInt(desc.id)){
            data[key].splice([i], 1);
            data[key].unshift(desc);
            break;
          }
        }
      }
    }
    this.setState({
      trello: data
    })
  }
  deleteCard(id, list){
    let testPass = false;
    for(let key in data){
      if(testPass) {
        break;
      } else {
        if(key === list){
          testPass = true;
          for(let i=0; i< data[key].length; i++){
            if(data[key][i].id === parseInt(id)){
              data[key].splice([i], 1);
              break;
            }
          }
        }
      }
    }
    this.setState({
      trello: data
    })
  }
  deleteList(listname){
    for(let key in data){
      if(key === listname){
        delete data[key];
      }
    }
    this.setState({
      trello: data
    })
  }
  renderList() {
    const activityList = [];
    for (let key in this.state.trello) {
      activityList.push(<Activityboard backlogData={this.state.trello[key]} listName={key} key={key} onDropEvent={this.onDropEvent} createCardBody={this.createNewCard} updateCard={this.updateCard} deleteCardData={this.deleteCard} deleteList={this.deleteList}/>)
    }
    return <div className="body-scroller">
      {activityList}
    </div>
  }
  toggleModal(){
    this.setState({
      openModal: true
    })
  }
  closeModal(){
    this.setState({
      openModal: false
    })
  }
  createNewList(e){
    let sampleData =  {};
    sampleData[e] = [];
    data = Object.assign({},this.state.trello,sampleData);
    this.setState({
      trello: data
    });
  }
  render() {
    // this.renderList();
    return (
      <div className="body">
      <Banner openModal={this.toggleModal}/>
      <AddListModal modalStatus={this.state.openModal} closeModal={this.closeModal} createList={this.createNewList}/>
        {
          this.renderList()
        }
      </div>
    )
  }
}