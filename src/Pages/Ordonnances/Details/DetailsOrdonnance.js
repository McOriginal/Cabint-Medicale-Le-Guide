import React, { useState } from 'react';
import PaiementsHistorique from '../PaiementsHistorique/PaiementsHistorique';
import ProtocoleOrdonnance from './ProtocoleOrdonnance';
import OrdonnancePaper from './OrdonnancePaper';

export default function DetailsOrdonnance() {
  const [tog_display_modal, set_tog_display_modal] = useState(false);

  const tog_modal = () => {
    set_tog_display_modal(!tog_display_modal);
  };

  return (
    <React.Fragment>
      <div className='page-content'>
        <ProtocoleOrdonnance
          tog_open_modal={tog_modal}
          display_modal={tog_display_modal}
          setClose_modal={set_tog_display_modal}
        />

        <OrdonnancePaper />

        <PaiementsHistorique />
      </div>
    </React.Fragment>
  );
}
