// TODO: Refactor this component. It is so big 
import React from 'react';
import './contact-form.css';
import PropTypes from 'prop-types';
import { Form, Button, Divider } from 'semantic-ui-react';
import Slots from './Slots';
import AddAvatarModal from './AddAvatarModal';
import Dates from './Dates';
import { slotTypes, months as monthCollection } from './constants';
import { ContactsContext } from 'contexts';
import ContactOptions from './ContactOptions';
import Avatar from './Avatar';
import '../PreviewContact/preview-contact.scss';

class ContactForm extends React.Component {
  static contextType = ContactsContext.Consumer;
  static propTypes = {
    initialValues: PropTypes.object
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      isAddingField: false,
      isCustomField: false,
      isAddingAvatar: false,
      isAddingDate: false,
      form: {
        firstName: '',
        lastName: '',
        department: '',
        favorite: false,
        slots: [],
        dates: [],
        avatar: null
      }
    };
  }

  get isFormInvalid() {
    const form = this.state.form;
    if (!form.firstName || !form.lastName || !form.department) {
      return true;
    }
    return false;
  }

  get slots() {
    if (this.state.form.slots && this.state.form.slots.length > 0) {
      return (
        <React.Fragment>
          <Divider />
          <ul className="contact-slots">
            {
              this.state.form.slots.map((slot, index) => (
                <li key={index}>
                  {
                    slot.type === 9 ?
                    <span className="preview-subtitle">{slot.customSlotType}</span> :
                    <span className="preview-subtitle">{slotTypes[slot.type].text}</span>
                  }
                  <p>{slot.value}</p>
                </li>
              ))
            }
          </ul>
        </React.Fragment>
      )
    }
  }

  get dates() {
    if (this.state.form.dates && this.state.form.dates.length > 0) {
      return (
        <React.Fragment>
          <Divider />
          <ul className="contact-dates">
            {
              this.state.form.dates.map((dateItem, index) => {
                const dateValue = new Date(dateItem.dateValue);
                return (
                  <li key={index}>
                    <span className="preview-subtitle">{dateItem.label}</span><br />
                    <span>{monthCollection[dateValue.getMonth()].text}</span>&nbsp;&#47;&nbsp;
                    <span>{dateValue.getDate()}</span>&nbsp;&#47;&nbsp;
                    <span>{dateValue.getFullYear()}</span>
                  </li>
                );
              })
            }
          </ul>
          <Divider />
        </React.Fragment>
      )
    }
  }

  toggleAddingField = () => this.setState({ isAddingField: !this.state.isAddingField });
  toggleAddingDate = () => this.setState({ isAddingDate: !this.state.isAddingDate });

  openAddingAvatar = () => this.setState({ isAddingAvatar: true });
  closeAddingAvatar = () => this.setState({ isAddingAvatar: false });

  handleChange = (e, { name, value }) => {
    this.setState({
      form: { ...this.state.form, [name]: value  }
    });
  };

  handleSubmit = async e => {
    e.preventDefault();
    try {
      if (this.props.initialValues) {
        await this.context.actions.update(this.props.initialValues.id, this.state.form);
      } else {
        await this.context.actions.create(this.state.form);
      }
    } catch (error) {
      console.error(error);
      this.setState({ error });
    }
  }

  /**
   * Appends a `slot` object to the collection of slots.
   * 
   * @param {Object} slot - Slot properties.
   * @param {number} slot.type - The slot type.
   * @param {string} slot.customSlotType - Slot name.
   * @param {string} slot.value - Slot value.
   */
  addSlot = ({ type, customSlotType, value }) => {
    const next = {
      ...this.state, 
        isAddingField: false,
        form: { 
        ...this.state.form, slots: [ 
          ...this.state.form.slots, {
            type, customSlotType, value 
          } 
        ] 
      } 
    };

    this.setState(next);
  }

  /**
   * Appends a `date` object to the collection of dates.
   * 
   * @param {Object} date - Date.
   * @param {number} date.day - Day of the month.
   * @param {number} date.month - Month number.
   * @param {number} date.year - Year.
   */
  addDate = ({ dateValue, label }) => {
    const next = {
      ...this.state,
        isAddingDate: false,
        form: {
        ...this.state.form, dates: [
          ...this.state.form.dates, {
            dateValue, label
          }
        ]
      }
    }
    this.setState(next);
  }
  
  handleFileLoad = e => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (e) => {
      const next = {
        ...this.state, form: {
          ...this.state.form, avatar: fileReader.result
        }
      };
      this.setState(next);
    };
  }

  discardAvatarUpdate = () => {
    const next = {
      ...this.state, 
        isAddingAvatar: false,
        form: {
          ...this.state.form, avatar: null
        }
    };
    this.setState(next);
  }

  handleFavorite = (e, { checked }) => {
    const next = {
      ...this.state, form: {
        ...this.state.form, favorite: checked
      }
    };

    this.setState(next);
  }

  componentDidMount() {
    const initialValues = this.props.initialValues;
    if (initialValues) {
      this.setState({
        form: {
          firstName: initialValues.firstName,
          lastName: initialValues.lastName,
          department: initialValues.department,
          favorite: initialValues.favorite,
          slots: initialValues.slots,
          dates: initialValues.dates,
          avatar: initialValues.avatar
        }
      });
    }
  }

  render() {
    const { onClose, initialValues } = this.props;
    const { isAddingField, isAddingAvatar, isAddingDate, form, error, favorite } = this.state;
    return (
      <div>
      <AddAvatarModal 
        isOpen={isAddingAvatar} 
        onClose={this.closeAddingAvatar}
        handleFileLoad={this.handleFileLoad}
        avatar={form.avatar}
        onDiscard={this.discardAvatarUpdate}
      />
      <Form onSubmit={this.handleSubmit}>
        <header className="form-header">
          <Avatar  avatar={form.avatar} onClick={this.openAddingAvatar} />
        </header>
        <Form.Input 
          name="firstName"
          label="First Name" 
          type="text" 
          onChange={this.handleChange}
          value={form.firstName}
        />
        <Form.Input 
          name="lastName"
          label="Last Name" 
          type="text" 
          onChange={this.handleChange} 
          value={form.lastName}
        />
        <Form.Input
          name="department"
          label="Department" 
          type="text" 
          onChange={this.handleChange}
          value={form.department}
        />
        <ContactOptions 
          isFavorite={favorite}
          handleFavorite={this.handleFavorite}
        />
        {
          isAddingField ?
          <Slots 
            onSelect={this.addSlot} 
            onCancel={this.toggleAddingField} 
          /> :
          this.slots
        }
        {
          isAddingDate ?
          <Dates 
            onSelect={this.addDate} 
            onCancel={this.toggleAddingDate}
          /> :
          this.dates
        }
        <div className="field-options-container">
          {
            isAddingField ? 
              null : 
              <Button onClick={this.toggleAddingField}>
                Add Field
              </Button>
          }
          {
            isAddingDate ?
            null :
            <Button onClick={this.toggleAddingDate}>
              Add Date
            </Button>
          }
        </div>
        {
          error ?
          <p>{JSON.stringify(error)}</p> :
          null
        }
        <div className="controls-align">
        {
          initialValues ?
          <Button
            primary
            type="submit"
            disabled={this.isFormInvalid}
          >
            Update
          </Button> :
          <Button 
            primary 
            type="submit"
            disabled={this.isFormInvalid}
          >
            Create
          </Button>
        }
          <Button 
            secondary
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </Form>
      </div>
    );
  }
}

export default ContactForm;
