import React from 'react';
import Select from 'react-select';
import Service from '../js/service.js';

class ModerationPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      moderationState: this.props.moderationState
    };
  }

  getModerationStates(input, callback) {
    Service.moderationStates
      .get()
      .then((data) => {
        let options = data.map((option) => {
          return { value: option.id, label: option.name };
        });

        callback(null, {options});
      })
      .catch((reason) => {
        console.error(reason);
      });
  }

  getNonce(callback) {
    Service.nonce()
      .then((nonce) => {
        callback(false, nonce);
      })
      .catch((reason) => {
        callback(new Error(`Could not retrieve data from /nonce. Reason: ${reason}`));
      });
  }

  handleModerationStateChange(selected) {
    this.getNonce((error, nonce) => {
      if (error) {
        console.error(error);
        return;
      }

      let formattedNonce = {
        nonce: nonce.nonce,
        csrfmiddlewaretoken: nonce.csrf_token
      };

      Service.entry
        .put.moderationState(this.props.id, selected.value, formattedNonce)
        .then(() => {
          this.setState({ moderationState: selected });
        })
        .catch(reason => {
          this.setState({
            serverError: true
          });
          console.error(reason);
        });
    });
  }

  render() {
    return <div className="moderation-panel p-3">
              <Select.Async
                name="form-field-name"
                value={this.state.moderationState}
                className="d-block text-left"
                searchable={false}
                loadOptions={(input, callback) => this.getModerationStates(input, callback)}
                onChange={(selected) => this.handleModerationStateChange(selected)}
                clearable={false}
              />
            </div>;
  }
}

ModerationPanel.defaultProps = {
  id: ``,
  moderationState: ``
};

export default ModerationPanel;
