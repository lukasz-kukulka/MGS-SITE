import React, { useState } from 'react';

const Counter = () => {
    const [count, setCount] = useState(0);
    // console.log('test');
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Counter: {count}</h1>
            <button onClick={() => setCount(count + 1)}>Increment</button>
            <button onClick={() => setCount(count - 1)}>Decrement</button>
        </div>
    );
};

export default Counter;