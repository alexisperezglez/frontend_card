import React, {useState, useEffect, Fragment} from 'react';
import './App.css';
import 'primeflex/primeflex.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import webServices from "./services/webServices";
import {Button} from "primereact/button";
import {InputTextarea} from "primereact/inputtextarea";
import {InputSwitch} from "primereact/inputswitch";

const App = () => {
  const initialCard = {
    id: -1,
    description: '',
    active: false,
    createAt: null,
  };

  const [cards, setCards] = useState([])
  const [selectedCard, setSelectedCard] = useState(initialCard)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    webServices.getAllCards().then((response) => {
      setCards(response.data);
    });
  }, []);

  const selectCard = (card) => {
    setSelectedCard({
      ...selectedCard,
      ...card,
    });
  }

  const removeCard = (card) => {
    webServices.deleteCard(card.id).then((response) => {
      const filterCards = cards.filter((it) => it.id !== card.id);
      setCards(filterCards);
    })
  }

  const statusBodyTemplate = (rowData) => {
    return <span>{rowData.active ? 'SI' : 'NO'}</span>;
  }

  const dateBodyTemplate = (rowData) => {
    return <span>{rowData.createAt ? new Date(rowData.createAt).toLocaleString('en-US') : ''}</span>;
  }

  const actionsBodyTemplate = (rowData) => {
    return <Fragment>
      <Button icon="pi pi-pencil" onClick={() => {selectCard(rowData)}}/>
      <Button icon="pi pi-times" className="p-button-danger p-button-rounded" onClick={() => {removeCard(rowData)}}/>
    </Fragment>;
  }

  const enableNewCard = () => {
    setSelectedCard(initialCard)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCard.id > 0) {
      webServices.updateCard(selectedCard).then((response) => {
        const resp = response.data;
        const cardsList = cards.map((it) => {
          if (it.id === resp.id) {
            return resp;
          }
          return it;
        });
        setCards(cardsList);
        setSelectedCard(initialCard);
      });
    } else {
      webServices.saveCard(selectedCard).then((response) => {
        const resp = response.data;
        setCards([...cards, resp]);
        setSelectedCard(initialCard);
      });
    }
  }

  const headerTemplate = (
    <div className="table-header">
      Cards
      <Button icon="pi pi-plus" onClick={() => {
        enableNewCard()
      }} />
    </div>
  );

  return (
      <div className="p-grid">
        <div className="p-col-3">
          <form onSubmit={(e) => handleSubmit(e)}>
            <h5>Descripcion</h5>
            <InputTextarea disabled={!(selectedCard)}
                           rows={5}
                           cols={30}
                           value={selectedCard?.description}
                           onChange={(e) => setSelectedCard({...selectedCard, description: e.target.value})} />
            <h5>Activo / Desactivo</h5>
            <InputSwitch disabled={!(selectedCard)}
                         checked={selectedCard?.active || false}
                         onChange={(e) => setSelectedCard({...selectedCard, active: e.value})} />
            <br/><br/>
            <Button label={selectedCard ? 'Editar' : 'Guardar'}
                    type="submit"
                    disabled={!(selectedCard)} />
            <Button label="Limpiar"
                    type="reset" />
          </form>
        </div>
        <div className="p-col-9">
          <DataTable value={cards}
                     className="p-datatable-striped"
                     header={headerTemplate}>
            <Column field="id" header="ID"/>
            <Column header="Fecha" body={dateBodyTemplate.bind(this)}/>
            <Column header="Activo" body={statusBodyTemplate.bind(this)}/>
            <Column field="description" header="Descripcion"/>
            <Column header="Acciones" body={actionsBodyTemplate.bind(this)}/>
          </DataTable>
        </div>
      </div>
  );
}

export default App;
