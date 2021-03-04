import React, { forwardRef, memo, useCallback, useImperativeHandle, useState } from 'react';
import './column.component.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useSubject } from "@utilities/utils";
import { Subject } from "rxjs";
import { cloneDeep } from "lodash";
import { tap } from "rxjs/operators";

interface Props {
	name: string;
}

interface State {
	loading: boolean;
	source: string[];
	list: string[];

}

export interface Ref {
	addItem: Subject<string>;
	filterItem: Subject<string>;
}

const initialState = (props: Props) => {
	return {
		loading: false,
		source: [],
		list: [],
	};
};

export const ColumnComponent = memo(
	forwardRef<Ref, Props>((props, ref) => {
		const [state, setState] = useState<State>(initialState(props));

		const addItem = useSubject<string>(($subject) => $subject.pipe(
			tap((item) => {
				const list = state.list;
				list.unshift(item);
				setState(prevState => ({...prevState, list, source: cloneDeep(list)}));

			}),
		), [state]);


		const filterItem = useSubject<string>(($subject) => $subject.pipe(
			tap(filter => {
				console.log('gaga-------------------------------------', state.source);
				const list = state.source.filter(item => {
					return item.toLowerCase().includes(filter.toLowerCase());
				});
				setState(prevState => ({...prevState, list}));

			}),
		), [state]);


		const removeItem = useCallback((index) =>{
			return () => {
				const list = state.list.filter((s,i) => i!== index);
				setState(prevState => ({...prevState, list, source: cloneDeep(list)}));
			};
		}, [state]);



		useImperativeHandle(ref, () => ({
			addItem,
			filterItem,
		}));


		return (
			<div id="column-wrap">
				<div className={'ttl'}>
					<span>{props.name}</span>
				</div>

				<div className={'content-list'}>

					{
						state.list.map((item, index) => {
							return (
								<div
									key={index + item}
									className={'item'}>
									<span>{item}</span>
									<button onClick={removeItem(index)}>
										<FontAwesomeIcon
											icon={faTimes}
											color={'#FFF'}/>
									</button>
								</div>
							);
						})
					}

				</div>
			</div>
		);
	}),
);


