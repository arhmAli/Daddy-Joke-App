import React, { Component } from 'react'
import Joke from './Joke'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import './jokelist.css'
class JokesList extends Component {
    static defaultProps={
        numstoget:10
    }
    constructor(props){
        super(props);
        this.state={jokes:JSON.parse(window.localStorage.getItem('jokes')||'[]'),isLoading:false}
        this.seenJokes=new Set(this.state.jokes.map(j=>j.text))
        this.handleClick=this.handleClick.bind(this)
      }
   componentDidMount(){
    if(this.state.jokes.length===0)this.getJokes()
    }
   async getJokes(){
try{
    let jokes=[]
    while(jokes.length<this.props.numstoget){
    let headers={headers:{Accept:'application/json'}}
    let res=await axios.get('https://icanhazdadjoke.com/',headers)
    if(!this.seenJokes.has(res.data.joke)){
    jokes.push({id:uuidv4(),text:res.data.joke,vote:0})
    } else{
      console.log("duplicate")
      
      console.log(res.data.joke)
    }
    }
     this.setState(st=>({
      isLoading:false,
      jokes:[...st.jokes,...jokes]
     }),()=>window.localStorage.setItem('jokes',JSON.stringify(this.state.jokes)))
    window.localStorage.setItem('jokes',JSON.stringify(jokes))
  }
  catch(e){
   alert(e) 
   this.setState({isLoading:false})
  }
    }
    handleUpdate(id,delta){
      this.setState(s=>({
        jokes:s.jokes.map(k=>
          k.id===id?{...k,vote:k.vote+delta}:k
          )
      }),()=>window.localStorage.setItem('jokes',JSON.stringify(this.state.jokes))
      )
    }
    handleClick(){
      this.setState({isLoading:true},this.getJokes)
    }
  render() {
    if(this.state.isLoading){
      return(
        <div className='JokeList-spinner'>
          <i className='far fa-8x fa-laugh fa-spin'/>
          <h1 className='JokeList-title loader'>Loading...</h1>
        </div>
      )
    }
    let theRealJokes=this.state.jokes.sort((a,b)=>b.vote-a.vote)
    return (
      <div className='JokeList'>
        <div className='JokeList-sidebar'>
        <h1 className='JokeList-title' ><span>Dad</span> Jokes</h1>
        <img alt='laugh'src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg'/>
        <button className='JokeList-getmore' onClick={this.handleClick}>New Jokes</button>
        </div>
        <div className='JokeList-jokes'>
          {theRealJokes.map(j=>(
            <Joke key={j.id} text={j.text} votes={j.vote} upvotes={()=>(this.handleUpdate(j.id,1))} //yaha jo j.id hai wo ab jo array hai uski particular joke ki id le rha hai or handle update k andar hum ye id as a params de ge us k sath delta de ge jo k upvotes k lihaz se +1 hai phr hum state 
            downvotes={()=>(this.handleUpdate(j.id,-1))}/>                                          //set krte hue check kr rhe hai k ye id jo joke ki hai us id ka joke dhoondo agr to is wqt array me wo hai to hum vote me delta update kr de ge or agr wo nh mila to waise hi rehne do joke ko 'k'
        ))}</div>                                                                                   
      </div>                                                                                          //
    )
  }
}
export default JokesList
