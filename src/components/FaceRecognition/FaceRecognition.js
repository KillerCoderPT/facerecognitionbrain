import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ boxes, imageUrl }) => {
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id='inputImage' src={imageUrl} alt="" width='500px' height='auto' />
                {boxes.map(box => 
                    <div key={`box${box.topRow}${box.rightCol}`}
                        className='bounding-box' 
                        style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
                )}
            </div>
        </div>
    );
}

export default FaceRecognition;