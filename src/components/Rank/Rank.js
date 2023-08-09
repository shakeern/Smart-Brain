import React from 'react';


const Rank = ({name, entries}) => {
    return (
       <div className='white f3'>
        <div >
            { name + ', you have scanned ' + entries + ' pictures'}
        </div>
       </div>
    );
}

export default Rank;