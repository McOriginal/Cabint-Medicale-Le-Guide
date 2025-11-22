import {
  hospitalAdresse,
  hospitalLittleName,
  hospitalOwnerName,
  hospitalTel,
  logoMedical,
} from '../../CompanyInfo/CompanyInfo';

export default function OrdonnanceHeader() {
  return (
    <>
      <div>
        <img
          src={logoMedical}
          alt='logo'
          style={{
            width: '100px',
            position: 'absolute',
            top: '30px',
            left: '10px',
          }}
        />
        <div className='text-center text-info fw-bold '>
          <h3 className='text-info fw-bold'>CABINET MEDICAL </h3>
          <h2 className='text-info fw-bold'>{hospitalLittleName} </h2>
          <p
            style={{
              margin: '5px',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            {hospitalOwnerName}
          </p>

          <p style={{ margin: '5px', fontSize: '10px' }}>{hospitalAdresse}</p>
          <p style={{ margin: '5px', fontSize: '10px' }}>{hospitalTel}</p>
        </div>

        <img
          src={logoMedical}
          alt='logo'
          style={{
            width: '100px',
            position: 'absolute',
            top: '30px',
            right: '10px',
          }}
        />
      </div>
    </>
  );
}
