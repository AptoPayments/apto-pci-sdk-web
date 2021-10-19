import React from 'react';
import IApplicationState from './IApplicationState';

type IStateFn = React.Dispatch<Partial<IApplicationState>>;

export default IStateFn;
