import { IonContent,IonHeader, IonPage,IonCardContent,IonList,
         IonModal, IonTitle, IonToolbar,IonCardTitle,IonLabel,IonAvatar,
         IonButton, IonInput,IonItem,IonCard,IonFabButton,IonIcon,
         IonItemSliding,IonItemOptions,IonItemOption,
         useIonViewWillEnter } from '@ionic/react';

import React,{ useState } from 'react';
import { add, trash, pencil, person, close } from 'ionicons/icons';
import './Home.css';
import { student } from '../model/student'
let uri="http://localhost/apistudent/public/student" //backend laravel

const Home: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [listStudents, setListStudents] = useState<student[]>([]);
  const [nombre , setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [avatar, setAvatar] = useState('') 
  
  useIonViewWillEnter(() => {
    getStudents()
})

  async function getStudents() {
    const response = await fetch(uri)
    const result = await response.json();
    setListStudents(result.student)
}

async function addStudent(){
  const formData = new FormData();
  formData.append('nombre', nombre);
  formData.append('apellido', apellido);
  formData.append('url', avatar);
  const response = await fetch(uri, { method:'POST', body:formData })
  const result = await response.json();
  console.log(result)
  getStudents()
  clearInputs()
}

function clearInputs(){
  setNombre('')
  setApellido('')
  setAvatar('')
  
}


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle>app school</IonTitle>
          <IonButton slot="end" fill="outline" class="btn"
            onClick={() => setShowModal(true)}><IonIcon icon={add} /></IonButton>
        </IonToolbar>
      </IonHeader>
      
      <IonContent >
        <IonModal isOpen={showModal} >
         <IonCard>
          <IonCardTitle color="primary" class="title">
            add Student
          </IonCardTitle>
          <IonCardContent>
            <IonItem>
             <IonInput  placeholder="Nombre"  value={nombre}
               onIonChange={e => setNombre(e.detail.value!)} clearInput/>
            </IonItem>
     
            <IonItem>
             <IonInput  placeholder="Apellido" value={apellido}
             onIonChange={e => setApellido(e.detail.value!)} clearInput/>
            </IonItem>

            <IonItem>
            <IonInput placeholder="Url" value={avatar} 
             onIonChange={e => setAvatar(e.detail.value!)} clearInput/>
            </IonItem>
            <IonButton expand="block" fill="outline" 
                onClick={addStudent}>
                  <IonIcon icon={person} /></IonButton>

            <IonButton expand="block" fill="outline" color="danger"
                onClick={() => setShowModal(false)}>
                  <IonIcon icon={close} /></IonButton>
          </IonCardContent>
        </IonCard>
      </IonModal>

      <IonList>
        {  listStudents.map(student => (
         <IonItemSliding key={student.id} >       
          <IonItem >
            <IonAvatar>
             <img src={student.url} alt={student.id}/>
          </IonAvatar>
             <IonLabel class="label">{student.nombre} {student.apellido}</IonLabel>
          </IonItem>
          
          <IonItemOptions side="end">
             <IonItemOption color="ligth"
                 onClick={() => console.log("delete")}>
                <IonFabButton size="small" color="danger">
                   <IonIcon icon={trash} />
                </IonFabButton>
          </IonItemOption>

          <IonItemOption color="ligth"
              onClick={() => console.log("update")}>
            <IonFabButton size="small" color="secondary">
               <IonIcon icon={pencil} />
            </IonFabButton>
          </IonItemOption>

        </IonItemOptions>
      </IonItemSliding>
        ))}
    </IonList>

      
      </IonContent>
    </IonPage>
  );
};

export default Home;
