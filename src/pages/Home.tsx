import { IonContent,IonHeader, IonPage,IonCardContent,IonList,
         IonModal, IonTitle, IonToolbar,IonCardTitle,IonLabel,IonAvatar,
         IonButton, IonInput,IonItem,IonCard,IonFabButton,IonIcon,
         IonItemSliding,IonItemOptions,IonItemOption,
         useIonViewWillEnter,IonAlert } from '@ionic/react';

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
  const [showAlert, setShowAlert] = useState(false) 
  const [id, setId] = useState('') 
  const [updateOrAdd, setUpdateOrAdd]=useState(false)


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
  setId('')
  setNombre('')
  setApellido('')
  setAvatar('')
  
}

 function deleteStudent(id:string){
    setId(id)
    setShowAlert(true)
} 

async function handlerDelete(){
  const response = await fetch(uri+"/"+id, {method:'DELETE'})
  const result = await response.json();
  console.log(result)
  setId('')
  getStudents()
}


async function getStudent(idS:string) {
  const response = await fetch(uri+"/"+idS);
  const result = await response.json();
  const {id, nombre, apellido, url } = result.student
  setId(id)
  setNombre(nombre)
  setApellido(apellido)
  setAvatar(url)
  setUpdateOrAdd(true)
  setShowModal(true)

}

async function UpdateStudent(){
  const formData = new FormData();
  formData.append("id",id)
  formData.append('nombre', nombre);
  formData.append('apellido', apellido);
  formData.append('url', avatar);
  const response = await fetch(uri+"/update" ,{ method:'POST', body:formData })
  const result = await response.json();
  console.log(result)
  getStudents()
  clearInputs()
  setUpdateOrAdd(false)
  
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
                onClick={ updateOrAdd? UpdateStudent:addStudent }>
                  <IonIcon icon={person} /></IonButton>

            <IonButton expand="block" fill="outline" color="danger"
                onClick={() => setShowModal(false)}>
                  <IonIcon icon={close} /></IonButton>
          </IonCardContent>
        </IonCard>
      </IonModal>

      <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass='my-custom-class'
          header={'Confirm!'}
          message={'<strong>Seguro que quieres elimarlo</strong>!!!'}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => { setShowAlert(false); setId('') }
            },
            { text: 'Okay', handler: handlerDelete }
          ]}
        />

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
                 onClick={() => deleteStudent(student.id+"")}>
                <IonFabButton size="small" color="danger">
                   <IonIcon icon={trash} />
                </IonFabButton>
          </IonItemOption>

          <IonItemOption color="ligth"
              onClick={() => getStudent(student.id+"")}>
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
