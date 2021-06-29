/*
Copyright 2021 The Matrix.org Foundation C.I.C.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from "react";
import Clock from "./Clock";
import { replaceableComponent } from "../../../utils/replaceableComponent";
import { MarkedExecution } from "../../../utils/MarkedExecution";
import {
    IRecordingUpdate,
    VoiceRecording,
} from "../../../voice/VoiceRecording";

interface IProps {
    recorder?: VoiceRecording;
}

interface IState {
    seconds: number;
}

/**
 * A clock for a live recording.
 */
@replaceableComponent("views.voice_messages.LiveRecordingClock")
export default class LiveRecordingClock extends React.PureComponent<IProps, IState> {
    private seconds = 0;
    private scheduledUpdate = new MarkedExecution(
        () => this.updateClock(),
        () => requestAnimationFrame(() => this.scheduledUpdate.trigger()),
    );

    constructor(props) {
        super(props);
        this.state = {
            seconds: 0,
        };
    }

    componentDidMount() {
        this.props.recorder.liveData.onUpdate((update: IRecordingUpdate) => {
            this.seconds = update.timeSeconds;
            this.scheduledUpdate.mark();
        });
    }

    private updateClock() {
        this.setState({
            seconds: this.seconds,
        });
    }

    public render() {
        return <Clock seconds={this.state.seconds} />;
    }
}