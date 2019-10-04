import React from 'react'
// import * as BooksAPI from './BooksAPI'
import './App.css'
//使用api取得主页各类书籍
import {getAll} from './BooksAPI'
//提交更新书架书信息
import {update} from './BooksAPI'
import {search} from './BooksAPI'
import {Route, Switch} from 'react-router-dom'
//导入子组件
import MPage from './mainPage.jsx'
import SPage from './searchPage.jsx'

//防抖
var timer=0;
class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    mainPageBook:[],
    searchResult:[]
  }

  //生命周期函数
  componentDidMount(){
      //取得promise对象值
      getAll().then((value)=>{
          // console.log(value);
          this.setState({
              mainPageBook:value
          })
      })
  }

  selectChange=(bookid,event)=>{
      //通过event事件对象捕获参数
      const shelf=event.target.value;
      // console.log(shelf);
      // console.log(bookid);
      //提交修改后的分类
      update({id:bookid},shelf).then(()=>{
           //更新书架
           getAll().then((value)=>{
               this.setState({
                   mainPageBook:value
               })
           })
      });
    }

  //处理input输入
  handleInput=(event)=>{
      // TODO: 加入防抖处理,
      const input=event.target.value.trim();

      if (input==='') {
          this.setState({
              searchResult: []
          })
          clearTimeout(timer);
          return;
      }

      clearTimeout(timer);
      timer = setTimeout(()=>{
          this.setState({
              searchResult: []
          })
          this.searchAndRequest(input);
      }, 600);
  }

  searchAndRequest=(input)=>{
      //请求查询结果
      search(input).then((result)=>{
          let searchPageBook=result;
          let mainPageBook=this.state.mainPageBook;
          //console.log(result);
          //判断结果数组是否有效
          if (result.length>0) {
              //将搜索结果加入shelf属性,必须搜索结果数组放外层循环
              for (var i = 0; i < searchPageBook.length; i++) {
                  for (var j = 0; j < mainPageBook.length; j++) {
                      if (searchPageBook[i].id===mainPageBook[j].id) {
                          searchPageBook[i].shelf=mainPageBook[j].shelf;
                          //必须结束查找，保证不会被覆盖
                          break;
                      }else{
                          searchPageBook[i].shelf='none'
                      }
                  }
              }
              this.setState({
                  searchResult:searchPageBook
              })
          }else{
              this.setState({searchResult: []})
          }
      })
  }

  //主页点击添加按钮
  openSearchPage=(value)=>{
      // console.log(value);
      this.setState({ searchResult:[] })
  }

  //搜索页点击返回按钮回调
  backToMainPage=()=>{
      this.setState({ showSearchPage: false })
  }

  render() {
    const mainPageBooks=this.state.mainPageBook;
    const searchResults=this.state.searchResult;
    return (
      <div className="app">
        <Switch>
            <Route path='/' exact render={() => (<MPage mainPageBooks={mainPageBooks} selectChange={this.selectChange} openSearchPage={this.openSearchPage}/>)}></Route>
            <Route path='/search' render={()=>(<SPage searchResults={searchResults} selectChange={this.selectChange} handleInput={this.handleInput} backToMainPage={this.backToMainPage}/>)}></Route>
        </Switch>
      </div>
    )
  }
}

export default BooksApp
