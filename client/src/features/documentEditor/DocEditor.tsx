import '../../App.css';
import {
  DocumentEditorContainerComponent,
  Toolbar,
} from '@syncfusion/ej2-react-documenteditor';

DocumentEditorContainerComponent.Inject(Toolbar);

const DocEditor = () => (
  <div className="h-screen w-full">
    <DocumentEditorContainerComponent
      id="container"
      height={'100%'}
      serviceUrl="https://services.syncfusion.com/react/production/api/documenteditor/"
      enableToolbar={true}
    />
  </div>
);

export default DocEditor;
