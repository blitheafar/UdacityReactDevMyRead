import React from 'react'
import {Link} from 'react-router-dom'

const MainPage=(props)=>{
    //在父组件设好回调函数
    const mainPageBooks=props.mainPageBooks;
    const selectChange=props.selectChange;
    const openSearchPage=props.openSearchPage;
    const BOOKTITLE=['Currently Reading','Want to Read','Read'];
    const BOOKSHELF=['currentlyReading','wantToRead','read'];
    return (
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
                                                    <select value={book.shelf} onChange={selectChange.bind(this,book.id)}>
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
            <button onClick={openSearchPage.bind(this)}>Add a book</button>
          </Link>
        </div>
    )
}

export default MainPage;
