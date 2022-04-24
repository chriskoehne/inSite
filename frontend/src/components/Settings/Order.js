import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { SocialIcon } from 'react-social-icons';
import styles from './Settings.module.css';
import axios from 'axios';

import { ReactComponent as ListBullet } from './ListBullet.svg';
import useDidMountEffect from '../../hooks/useDidMountEffect';

let socialMedias = [
  {
    id: 'reddit',
    name: 'Reddit',
    icon: (
      <SocialIcon
        fgColor='white'
        network='reddit'
        onClick={(e) => {
          e.preventDefault();
        }}
      />
    ),
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: (
      <SocialIcon
        fgColor='white'
        network='twitter'
        onClick={(e) => {
          e.preventDefault();
        }}
      />
    ),
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: (
      <SocialIcon
        fgColor='white'
        network='youtube'
        onClick={(e) => {
          e.preventDefault();
        }}
      />
    ),
  },  
  {
    id: 'twitch',
    name: 'Twitch',
    icon: (
      <SocialIcon
        fgColor='white'
        network='twitch'
        onClick={(e) => {
          e.preventDefault();
        }}
      />
    ),
  },
];

const orderCards = () => {
  let positions = {};
  for (let [index, val] of JSON.parse(
    localStorage.getItem('settings')
  ).cardOrder.entries()) {
    positions[val] = index;
  }
  let order = Array(4);
  for (const sm of socialMedias) {
    order[positions[sm.id]] = sm;
  }
  return order;
};

const Order = () => {
  let settings = JSON.parse(localStorage.getItem('settings'));
  const [cardOrder, setCardOrder] = useState(orderCards());

  useDidMountEffect(() => {
    const updateCardOrder = async () => {
      try {
        let idsOnly = [];
        for (const card of cardOrder) {
          idsOnly.push(card.id);
        }
        const body = {
          email: localStorage.getItem('email'),
          cardOrder: idsOnly,
        };
        const res = await axios.post('/user/settings/cardOrder', body);
        if (res.status === 200) {
          // console.log(res)
          settings.cardOrder = idsOnly;
          localStorage.setItem('settings', JSON.stringify(settings));
        } else {
          console.log('Could not update cardOrder!');
        }
      } catch (err) {
        console.log(err);
      }
    };
    updateCardOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardOrder]);

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(cardOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCardOrder(items);
  }

  return (
    <div style={{ width: '100%' }}>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId='socialMedias'>
          {(provided) => (
            <ul
              className={styles.dnd}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {cardOrder.map(({ id, name, icon }, index) => {
                return (
                  <Draggable key={name} draggableId={name} index={index}>
                    {(provided) => (
                      <div
                        className={styles.socialsItem}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <ListBullet
                          style={{
                            fill: 'var(--primary)',
                            height: '80px',
                            paddingRight: '16px',
                          }}
                        />
                        <div style={{ padding: '2%' }}>{icon}</div>
                        <div
                          style={{
                            backgroundColor: `var(--${id})`,
                            height: '70%',
                            borderRadius: '2em',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            marginLeft: '5%',
                            marginRight: '5%',
                          }}
                        >
                          <h4
                            style={{
                              color: 'white',
                              textAlign: 'center',
                              margin: '0',
                            }}
                          >
                            {name}
                          </h4>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Order;
