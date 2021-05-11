import {render, screen, getAllByRole, act, getByLabelText, fireEvent, getAllByDisplayValue} from '@testing-library/react';
import App from './App';
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

const whenStable = async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test('renders learn react link', async () => {
  const initialValue = [];
  const mock = new MockAdapter(axios);

  const mockData = [
    {id: "123123123", description: "descripcion1", createAt: null, active: true},
    {id: "456456456", description: "descripcion2", createAt: null, active: false},
    {id: "789789789", description: "descripcion3", createAt: null, active: true},
  ];
  const url = "http://localhost:8080/api/rest/v1/cards";
  mock.onGet(url).replyOnce(200, mockData)
      .onGet(url + '/123123123').reply(200)
      .onDelete(url + '/123123123').reply(200)
      .onPost(url).reply(200, {id: "14141414", description: "description5", active: true, createAt: null})
      .onPut(url).reply(200, {id: "14141414", description: "description5", active: true, createAt: null});

  const {container} = render(<App/>);
  await whenStable();
  const cards = getAllByRole(container, "row");
  const buttons = container.querySelectorAll('button')
  const texarea = container.querySelector('textarea')
  // const swichtButton = container.querySelector('')
  expect(cards.length).toBe(4);

  await act(async () => {
    fireEvent.click(buttons[4]);
    await whenStable();
    await sleep(500);
    const cards2 = getAllByRole(container, "row");
    expect(cards2.length).toBe(3);
  });

  await act(async () => {
    fireEvent.click(buttons[3]);
    await whenStable();
    fireEvent.change(texarea, { target: { value: 'description' } });
    fireEvent.click(buttons[0]);
    await whenStable();
    await sleep(500);
    const cards3 = getAllByRole(container, "row");
    expect(cards3.length).toBe(3);
  });

  await act(async () => {
    fireEvent.click(buttons[2]);
    fireEvent.change(texarea, { target: { value: 'description' } });
    fireEvent.click(buttons[0]);
    await whenStable();
    await sleep(500);
    const cards2 = getAllByRole(container, "row");
    expect(cards2.length).toBe(3);
  });
});
