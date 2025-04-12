// components/SplineModel.jsx
import Spline from '@splinetool/react-spline';

const SplineModel = () => {
  return (
    <div className="w-full h-full">
      <Spline 
        scene="https://prod.spline.design/GsIzBSv1dzreITcu/scene.splinecode"
        className="w-full h-full"
        style={{ 
          borderRadius: '0.75rem',
          background: 'transparent'
        }}
      />
    </div>
  );
};

export default SplineModel;
