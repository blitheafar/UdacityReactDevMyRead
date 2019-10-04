//原始改进页面，已无效，供参考
import React from 'react'
// import * as BooksAPI from './BooksAPI'
import './App.css'
//使用api取得主页各类书籍
import {getAll} from './BooksAPI'
//提交更新书架书信息
import {update} from './BooksAPI'
import {search} from './BooksAPI'
import {Route, Link, Switch} from 'react-router-dom'

//搜素页
// import SearchPage from './searchPage'


class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
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

  selectChange(bookid,event){
      //通过event事件对象捕获参数
      const shelf=event.target.value;

      //提交修改后的分类
      update({id:bookid},shelf).then(()=>{
           console.log('update');
           //更新书架
           getAll().then((value)=>{
            console.log('getall');
               this.setState({
                   mainPageBook:value
               })
           })
      });
  }

  //处理input输入
  handleInput=(event)=>{
      // TODO: 加入节流防抖,
      // let trigger=setTimeout(()=>{
      //
      // },600);

      // console.log(event.target.value);
      const input=event.target.value.trim();
      // console.log(input);
      //判断input输入是否为空
      if (input==='') {
          this.setState({
              searchResult: []
          })
          return;
      }
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

              // console.log(searchPageBook);

              this.setState({
                  searchResult:searchPageBook
              })
          }else{
              this.setState({searchResult: []})
          }
      })


  }



  render() {
    const mainPageBooks=this.state.mainPageBook;
    const searchResults=this.state.searchResult;
    // console.log(mainPageBooks);
    const BOOKTITLE=['Currently Reading','Want to Read','Read'];
    const BOOKSHELF=['currentlyReading','wantToRead','read'];

    return (
      <div className="app">
        <Switch>
            <Route exact path='/' render={()=>(
                <div className="list-books">
                  <div className="list-books-title">
                    <h1>MyReads</h1>
                  </div>
                  <div className="list-books-content">
                    <div>
                      {
                          BOOKTITLE.map((item,index)=>{
                              return (
                                  <div className="bookshelf" key={item}>
                                    <h2 className="bookshelf-title">{item}</h2>
                                    <div className="bookshelf-books">
                                      <ol className="books-grid">
                                        {
                                            mainPageBooks.filter((book)=>{
                                                return book.shelf===BOOKSHELF[index];
                                            }).map((book)=>{
                                                return (
                                                    <li key={book.id}>
                                                      <div className="book">
                                                        <div className="book-top">
                                                          <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.smallThumbnail})` }}></div>
                                                          <div className="book-shelf-changer">
                                                            <select value={book.shelf} onChange={this.selectChange.bind(this,book.id)}>
                                                              <option value="move" disabled>Move to...</option>
                                                              <option value="currentlyReading">Currently Reading</option>
                                                              <option value="wantToRead">Want to Read</option>
                                                              <option value="read">Read</option>
                                                              <option value="none">None</option>
                                                            </select>
                                                          </div>
                                                        </div>
                                                        <div className="book-title">{book.title}</div>
                                                        <div className="book-authors">{book.authors[0]}</div>
                                                      </div>
                                                    </li>
                                                )
                                            })
                                        }
                                      </ol>
                                    </div>
                                  </div>
                              )
                          })
                      }
                    </div>
                  </div>
                  <Link className="open-search" to='/search'>
                    <button onClick={() => this.setState({ showSearchPage: true,searchResult:[] })}>Add a book</button>
                  </Link>
                </div>
                )}></Route>
            <Route path='/search' render={()=>(
                <div className="search-books">
                  <div className="search-books-bar">
                    <Link to='/'>
                        <button className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</button>
                    </Link>
                    <div className="search-books-input-wrapper">
                      {/*
                        NOTES: The search from BooksAPI is limited to a particular set of search terms.
                        You can find these search terms here:
                        https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                        However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                        you don't find a specific author or title. Every search is limited by search terms.
                      */}
                      <input type="text" placeholder="Search by title or author" onChange={this.handleInput}/>

                    </div>
                  </div>
                  <div className="search-books-results">
                    <ol className="books-grid">
                        {
                            searchResults.map((book)=>{
                                return (
                                    <li key={book.id}>
                                      <div className="book">
                                        <div className="book-top">
                                          <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks?book.imageLinks.smallThumbnail:''})` }}></div>
                                          <div className="book-shelf-changer">
                                            <select value={book.shelf} onChange={this.selectChange.bind(this,book.id)}>
                                              <option value="move" disabled>Move to...</option>
                                              <option value="currentlyReading">Currently Reading</option>
                                              <option value="wantToRead">Want to Read</option>
                                              <option value="read">Read</option>
                                              <option value="none">None</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="book-title">{book.title}</div>
                                        <div className="book-authors">{book.authors?book.authors[0]:''}</div>
                                      </div>
                                    </li>
                                )
                            })
                        }
                    </ol>
                  </div>
                </div>
                )}></Route>
        </Switch>
      </div>
    )
  }
}

export default BooksApp
