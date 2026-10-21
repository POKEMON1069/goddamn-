"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { contact, site } from "@/data/site";
import { RegistrationMark } from "./RegistrationMark";

type Errors = Partial<Record<"name" | "email" | "message" | "kind", string>>;

const emailOk = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [kind, setKind] = useState(contact.kinds[1]);
  const [values, setValues] = useState({
    name: "",
    email: "",
    org: "",
    budget: contact.budgets[1],
    message: "",
  });
  const formRef = useRef<HTMLFormElement | null>(null);
  const id = useId();

  const update = (key: keyof typeof values) => (event: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [key]: event.target.value }));


  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = "A name, even just a first one.";
    if (!emailOk(values.email)) next.email = "An address I can actually reply to.";
    if (values.message.trim().length < 24) next.message = "Twenty-four characters or more, so I have something to answer.";

    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="sent" role="status">
        <RegistrationMark className="sent__mark" />
        <p className="mono-xs">Sheet received</p>
        <h2 className="sent__title">Thanks, {values.name.split(" ")[0]}.</h2>
        <p className="sent__body">
          This demo form has no server behind it, so nothing was sent. Write to{" "}
          <a className="link-inline" href={`mailto:${site.email}`}>
            {site.email}
          </a>{" "}
          and I will answer within two working days.
        </p>
        <dl className="sent__facts">
          <div>
            <dt className="mono-xs">Kind</dt>
            <dd>{kind}</dd>
          </div>
          <div>
            <dt className="mono-xs">Budget</dt>
            <dd>{values.budget}</dd>
          </div>
        </dl>
        <button type="button" className="btn btn--ink" onClick={() => setSent(false)}>
          <span className="btn__label">Write another note</span>
          <span className="btn__rule" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} ref={formRef} noValidate>
      <div className="form__row">
        <div className={`field ${errors.name ? "has-error" : ""}`}>
          <label className="field__label" htmlFor={`${id}-name`}>
            <span>Your name</span>
            <span className="mono-xs field__req">Required</span>
          </label>
          <input
            id={`${id}-name`}
            name="name"
            className="field__input"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={update("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${id}-name-error` : undefined}
            aria-required="true"
          />
          {errors.name ? (
            <p className="field__error mono-xs" id={`${id}-name-error`}>
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className={`field ${errors.email ? "has-error" : ""}`}>
          <label className="field__label" htmlFor={`${id}-email`}>
            <span>Email</span>
            <span className="mono-xs field__req">Required</span>
          </label>
          <input
            id={`${id}-email`}
            name="email"
            className="field__input"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={update("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${id}-email-error` : undefined}
            aria-required="true"
          />
          {errors.email ? (
            <p className="field__error mono-xs" id={`${id}-email-error`}>
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <fieldset className="field field--set">
        <legend className="field__label">What is it?</legend>
        <div className="chips">
          {contact.kinds.map((option) => (
            <label className={`chip ${kind === option ? "is-on" : ""}`} key={option}>
              <input
                type="radio"
                name="kind"
                value={option}
                checked={kind === option}
                onChange={() => setKind(option)}
                className="chip__input"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="form__row">
        <div className="field">
          <label className="field__label" htmlFor={`${id}-org`}>
            <span>Company or project</span>
            <span className="mono-xs field__req">Optional</span>
          </label>
          <input
            id={`${id}-org`}
            name="org"
            className="field__input"
            type="text"
            autoComplete="organization"
            value={values.org}
            onChange={update("org")}
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor={`${id}-budget`}>
            <span>Budget</span>
            <span className="mono-xs field__req">Rupees, total</span>
          </label>
          <div className="field__select">
            <select
              id={`${id}-budget`}
              name="budget"
              className="field__input"
              value={values.budget}
              onChange={update("budget")}
            >
              {contact.budgets.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
            <span aria-hidden="true">↓</span>
          </div>
        </div>
      </div>

      <div className={`field ${errors.message ? "has-error" : ""}`}>
        <label className="field__label" htmlFor={`${id}-message`}>
          <span>What are you making?</span>
          <span className="mono-xs field__req">Required</span>
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          className="field__input field__input--area"
          rows={5}
          value={values.message}
          onChange={update("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${id}-message-error` : `${id}-message-hint`}
          aria-required="true"
        />
        {errors.message ? (
          <p className="field__error mono-xs" id={`${id}-message-error`}>
            {errors.message}
          </p>
        ) : (
          <p className="field__hint mono-xs" id={`${id}-message-hint`}>
          {"Rough is fine. "}
          {values.message.length > 0 ? `${values.message.trim().length} characters. ` : ""}
          I will ask better questions on the call.
        </p>
        )}
      </div>

      <div className="form__foot">
        <button type="submit" className="btn btn--ink btn--lg">
          <span className="btn__label">Send the note</span>
          <span className="btn__rule" aria-hidden="true" />
        </button>
        <p className="mono-xs form__note">
          Demo form, no server. Nothing leaves this page.
        </p>
      </div>
    </form>
  );
}
