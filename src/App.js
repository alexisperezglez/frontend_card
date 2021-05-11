import React, {useState, useEffect, Fragment} from 'react';
import logo from './logo.svg';
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
  const [cards, setCards] = useState([])
  const [selectedCard, setSelectedCard] = useState(null)
  const [newCard, setNewCard] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    webServices.getAllCards().then((response) => {
      setCards(response.data);
    });
  }, []);

  const selectCard = (card) => {
    setSelectedCard(card);
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

  const actionsBodyTemplate = (rowData) => {
    return <Fragment>
      <Button icon="pi pi-pencil" onClick={() => {selectCard(rowData)}}/>
      <Button icon="pi pi-times" className="p-button-danger p-button-rounded" onClick={() => {removeCard(rowData)}}/>
    </Fragment>;
  }

  const enableNewCard = () => {
    setSelectedCard(null);
    setNewCard({
      description: '',
      active: false,
    })
  }

  const sendData = (e) => {
    e.preventDefault();
    webServices.saveCard(selectedCard || newCard).then((response) => {
      const resp = response.data;
      let found = false;
      const cardsList = cards.map((it) => {
        if (it.id === resp.id) {
          found = true;
          return resp;
        }
        return it;
      });
      if (found) {
        cardsList.push(resp);
      }
      setCards(cardsList);
      setNewCard(null);
      setSelectedCard(null);
    });
  }

  const header = (
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
          <form onSubmit={(e) => sendData(e)}>
            <h5>Descripcion</h5>
            <InputTextarea disabled={!(newCard || selectedCard)} rows={5} cols={30} value={newCard?.description || ''} onChange={(e) => setNewCard({...newCard, description: e.target.value})} />
            <h5>Activo / Desactivo</h5>
            <InputSwitch disabled={!(newCard || selectedCard)} checked={newCard?.active || false} onChange={(e) => setNewCard({...newCard, active: e.value})} />
            <br/><br/>
            <Button label={selectedCard ? 'Editar' : 'Guardar'} type="submit" />
            <Button label="Limpiar" type="reset" />
          </form>
        </div>
        <div className="p-col-9">
          <DataTable value={cards} className="p-datatable-striped" header={header}>
            <Column field="id" header="ID"></Column>
            <Column field="createAt" header="Fecha"></Column>
            <Column header="Activo" body={statusBodyTemplate.bind(this)}></Column>
            <Column field="description" header="Descripcion"></Column>
            <Column header="Acciones" body={actionsBodyTemplate.bind(this)}></Column>
          </DataTable>
        </div>
      </div>
  );
}

export default App;
