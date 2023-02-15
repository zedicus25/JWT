import './SearchBlock.css'

function SearchBlock() {
    return(
        <div className='flexbox-row'>
            <h2 className='padding-top-15'>Asset shop</h2>
            <div className='flexbox-row'>
                <input className='margin-top-15 input' type='text' placeholder='Search assets'></input>
                <input className='margin-top-15' type='button' value='Search'></input>
            </div>
        </div>
    );
  }

  export default SearchBlock;